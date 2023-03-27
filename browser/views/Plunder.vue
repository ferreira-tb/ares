<script setup lang="ts">
import { watchEffect } from 'vue';
import { assertElement } from '@tb-dev/ts-guard-dom';
import { usePlunderConfigStore } from '$global/stores/plunder';
import { pickBestTemplate, queryTemplateData } from '$lib/plunder/templates';
import { queryTargetsInfo, targets } from '$browser/lib/plunder/targets';
import { queryAvailableUnits } from '$lib/plunder/units';
import { queryCurrentVillageInfo, navigateToNextPage } from '$lib/plunder/village';
import { PlunderAttackWithLoot } from '$lib/plunder/resources';
import { prepareAttack, eventTarget as attackEventTarget, sendAttackFromPlace } from '$lib/plunder/attack';
import { destroyWall } from '$lib/plunder/wall';
import { openPlace } from '$lib/plunder/place';
import { PlunderError } from '$browser/error';
import { ipcSend } from '$global/ipc';
import { generateRandomDelay } from '$global/utils/helpers';
import Reload from '$browser/components/plunder/Reload.vue';

const config = usePlunderConfigStore();

/** Tabela do assistente de saque. */
const plunderList = document.querySelector('#plunder_list:has(tr[id^="village"]) tbody');

// Reune informações necessárias para o funcionamento do Plunder.
await queryTemplateData();
queryTargetsInfo();

// Não é necessário bloquear a execução, visto que não são informações críticas para os primeiros ataques.
queueMicrotask(() => queryCurrentVillageInfo());

watchEffect(() => {
    // Interrompe qualquer ataque em andamento.
    attackEventTarget.dispatchEvent(new Event('stop'));
    // Começa a atacar se o Plunder estiver ativado.
    if (config.active) handleAttack();
});

async function handleAttack(): Promise<void> {
    if (!config.active || !plunderList) return;
    await queryAvailableUnits();

    // Seleciona todas as aldeias da tabela e itera sobre elas.
    const villages = plunderList.queryAsMap('tr[data-tb-village]', (e) => e.getAttributeStrict('data-tb-village'));
    for (const [id, village] of villages.entries()) {
        // Ignora caso ela esteja oculta, removendo-a da tabela.
        const style = village.getAttribute('style');
        if (style && /display:\s*none/.test(style)) {
            village.remove();
            targets.delete(id);
            continue;
        };

        // Ignora caso a aldeia já esteja sob ataque.
        const attackIcon = village.querySelector('img[src*="attack.png" i]');
        if (attackIcon) {
            targets.delete(id);
            continue;
        };

        /** Informações sobre a aldeia. */
        const info = targets.getStrict(id);

        // Ignora caso a aldeia esteja longe demais.
        if (info.distance > config.maxDistance) continue;
        // Ignora caso o relatório seja muito antigo.
        if ((Date.now() - info.lastAttack) > config.ignoreOlderThan * 3600000) continue;

        // Destrói a muralha da aldeia caso `destroyWall` esteja ativado.
        // Se o ataque for enviado com sucesso, pula para a próxima aldeia.
        // Essa opção deve estar sempre antes de `ignoreWall`.
        // Isso para que a aldeia seja ignorada caso a muralha não seja destruída e, claro, `ignoreWall` esteja ativado.
        if (
            config.destroyWall &&
            info.wallLevel >= config.wallLevelToDestroy &&
            info.distance <= config.destroyWallMaxDistance
        ) {
            const destroyed = await destroyWall(info);
            if (destroyed) continue;
        };

        // Ignora caso a aldeia tenha muralha e a muralha possua nível superior ao permitido.
        if (config.ignoreWall && info.wallLevel >= config.wallLevelToIgnore) continue;

        // Seleciona o modelo mais adequado para o ataque.
        const best = await pickBestTemplate(info);
        if (!best) continue;

        // Informações que serão enviadas ao painel.
        const plunderAttack = new PlunderAttackWithLoot(info, best.carry.value);

        if (best.type === 'a' || best.type === 'b' || best.type === 'c') {
            const attackButton = info.button[best.type];
            assertElement(attackButton, `O botão do modelo ${best.type.toUpperCase()} não foi encontrado.`);

            return prepareAttack(plunderAttack, attackButton)
                .then(() => best.reset())
                .then(() => targets.delete(id))
                .then(() => village.remove())
                .then(() => handleAttack())
                .catch(PlunderError.catch);

        } else {
            await openPlace(info.button.place);
            const sent = await sendAttackFromPlace(best.units);
            if (!sent) {
                throw new PlunderError(`O ataque usando o modelo ${best.type.toUpperCase()} falhou.`);
            };

            ipcSend('plunder-attack-sent', plunderAttack);
            targets.delete(id);
            village.remove();
            
            return handleAttack().catch(PlunderError.catch);
        };
    };

    // Caso, em toda tabela, não haja aldeia adequada para envio do ataque, verifica se há mais páginas.
    // Em caso positivo, tenta navegar para a próxima.
    setTimeout(() => navigateToNextPage(), generateRandomDelay(config.pageDelay, 200));
};
</script>

<template>
    <Reload :active="config.active" :minutesUntilReload="config.minutesUntilReload" />
</template>