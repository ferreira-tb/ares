<script setup lang="ts">
import { ref, watch, toRaw } from 'vue';
import { computedEager, whenever, watchImmediate } from '@vueuse/core';
import { Kronos } from '@tb-dev/kronos';
import { useCacheStore, useGameDataStore, usePlunderConfigStore } from '$renderer/stores';
import { pickBestTemplate, queryTemplateData } from '$lib/plunder/templates';
import { queryTargetsInfo, targets } from '$browser/lib/plunder/targets';
import { queryAvailableUnits } from '$lib/plunder/units';
import { queryCurrentVillageInfo } from '$lib/plunder/village';
import { PlunderAttackWithLoot } from '$lib/plunder/resources';
import { prepareAttack, eventTarget as attackEventTarget, sendAttackFromPlace } from '$lib/plunder/attack';
import { destroyWall } from '$lib/plunder/wall';
import { openPlace } from '$lib/plunder/place';
import { handleLackOfTargets } from '$lib/plunder/next';
import { queryPlunderGroupInfo } from '$lib/plunder/group';
import { PlunderError } from '$browser/error';
import { ipcSend } from '$renderer/ipc';
import PlunderReload from '$browser/components/PlunderReload.vue';

const cache = useCacheStore();
const config = usePlunderConfigStore();
const gameData = useGameDataStore();

/** Tabela do assistente de saque. */
const plunderList = document.querySelector('#plunder_list:has(tr[id^="village"]) tbody');
/** Informações sobre o grupo de saque. */
const groupInfo = ref<PlunderGroupType | null>(null);

/** Indica se a aldeia atual pertence ao grupo de saque. */
const belongsToPlunderGroup = computedEager(() => {
    if (!groupInfo.value || !gameData.village.id) return false;
    return groupInfo.value.villages.has(gameData.village.id);
});

/** Indica se ataques devem ser enviados. */
const shouldAttack = computedEager(() => {
    if (cache.captcha || !config.active || !plunderList) return false;
    if (config.groupAttack && !belongsToPlunderGroup.value) return false;
    return true;
});

// Reune informações necessárias para o funcionamento do Plunder.
await queryTemplateData();
queryTargetsInfo();
queryCurrentVillageInfo();

watch(groupInfo, (newValue) => {
    ipcSend('plunder:update-group-info', toRaw(newValue));
});

whenever(() => config.plunderGroupId, () => {
    ipcSend('plunder:navigate-to-group');
});

watch(() => config.groupAttack, async (isGroupAttackActive) => {
    if (isGroupAttackActive) {
        groupInfo.value = await queryPlunderGroupInfo();
    } else {
        groupInfo.value = null;
    };
});

watchImmediate(() => config.active, async (isActive) => {
    // Interrompe qualquer ataque em andamento.
    attackEventTarget.dispatchEvent(new Event('stop'));

    // Começa a atacar se o Plunder estiver ativado.
    if (isActive) {
        groupInfo.value = await queryPlunderGroupInfo();

        // Se a aldeia atual não pertencer ao grupo de saque, navega para alguma aldeia do grupo.
        if (config.groupAttack) {
            if (groupInfo.value && !belongsToPlunderGroup.value) {
                ipcSend('plunder:navigate-to-next-village');
                return;
            } else if (!config.plunderGroupId) {
                ipcSend('electron:show-message-box', {
                    type: 'warning',
                    title: 'Grupo de saque não selecionado',
                    message: 'Você precisa selecionar um grupo de saque para usar o ataque em grupo.'
                });
                return;
            };
        };

        handleAttack().catch(PlunderError.catch);
    };
});

async function handleAttack(): Promise<void> {
    if (!shouldAttack.value) return;
    await queryAvailableUnits();

    // Seleciona todas as aldeias da tabela e itera sobre elas.
    const villages = plunderList!.queryAsMap('tr[data-tb-village]', (e) => e.getAttributeStrict('data-tb-village'));
    for (const [id, village] of villages.entries()) {
        // Ignora caso ela esteja oculta, removendo-a da tabela.
        const style = village.getAttribute('style');
        if (style && /display:\s*none/.test(style)) {
            targets.delete(id);
            village.remove();
            continue;
        };

        // Ignora caso a aldeia já esteja sob ataque.
        const attackIcon = village.querySelector('img[src*="attack.png" i]');
        if (attackIcon) {
            targets.delete(id);
            village.remove();
            continue;
        };

        /** Informações sobre a aldeia. */
        const info = targets.getStrict(id);

        // Ignora caso a aldeia esteja longe demais.
        if (info.distance > config.maxDistance) continue;
        // Ignora caso o relatório seja muito antigo.
        if ((Date.now() - info.lastAttack) > config.ignoreOlderThan * Kronos.Hour) continue;

        if (config.groupAttack && groupInfo.value) {
            const villageStatus = groupInfo.value.villages.getStrict(gameData.getVillageId());
            if (info.distance > villageStatus.waveMaxDistance) continue;
        };

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
        const best = await pickBestTemplate(info, config);
        if (!best) continue;

        // Informações que serão enviadas ao painel.
        const plunderAttack = new PlunderAttackWithLoot(info, best.carry.value);

        if (best.type === 'a' || best.type === 'b' || best.type === 'c') {
            const attackButton = info.button[best.type];
            if (!attackButton) {
                throw new PlunderError(`Could not find attack button for template ${best.type.toUpperCase()}.`);
            };

            prepareAttack(plunderAttack, attackButton)
                .then(() => best.reset())
                .then(() => targets.delete(id))
                .then(() => village.remove())
                .then(() => handleAttack())
                .catch(PlunderError.catch);

            return;
        };

        await openPlace(info.button.place);
        const sent = await sendAttackFromPlace(best.units);
        if (!sent) throw new PlunderError(`Could not use template ${best.type.toUpperCase()}.`);

        ipcSend('plunder:attack-sent', gameData.village.id, plunderAttack);
        targets.delete(id);
        village.remove();
        
        handleAttack().catch(PlunderError.catch);
        return;
    };

    // Caso, em toda tabela, não haja aldeia adequada para envio do ataque, verifica se há mais páginas.
    // Após acessar todas as páginas possíveis, navega para a próxima aldeia se o ataque em grupo estiver ativado.
    handleLackOfTargets(groupInfo.value).catch(PlunderError.catch);
};
</script>

<template>
    <PlunderReload :active="config.active" :minutes-until-reload="config.minutesUntilReload" />
</template>