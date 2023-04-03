<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { computedEager } from '@vueuse/core';
import { assertElement } from '@tb-dev/ts-guard-dom';
import { useAresStore } from '$global/stores/ares';
import { usePlunderConfigStore } from '$global/stores/plunder';
import { useCurrentVillageStore } from '$global/stores/village';
import { pickBestTemplate, queryTemplateData } from '$lib/plunder/templates';
import { queryTargetsInfo, targets } from '$browser/lib/plunder/targets';
import { queryAvailableUnits } from '$lib/plunder/units';
import { queryCurrentVillageInfo } from '$lib/plunder/village';
import { PlunderAttackWithLoot } from '$lib/plunder/resources';
import { prepareAttack, eventTarget as attackEventTarget, sendAttackFromPlace } from '$lib/plunder/attack';
import { destroyWall } from '$lib/plunder/wall';
import { openPlace } from '$lib/plunder/place';
import { handleLackOfTargets } from '$lib/plunder/next';
import { queryPlunderGroupInfo, updateGroupInfo } from '$lib/plunder/group';
import { PlunderError } from '$browser/error';
import { ipcInvoke, ipcSend } from '$global/ipc';
import PlunderReload from '$browser/components/PlunderReload.vue';
import type { PlunderGroupType } from '$types/plunder';

const ares = useAresStore();
const config = usePlunderConfigStore();
const currentVillage = useCurrentVillageStore();

/** Tabela do assistente de saque. */
const plunderList = document.querySelector('#plunder_list:has(tr[id^="village"]) tbody');
/** Informações sobre o grupo de saque. */
const groupInfo = ref<PlunderGroupType | null>(null);
groupInfo.value = await queryPlunderGroupInfo();

/** Indica se a aldeia atual pertence ao grupo de saque. */
const belongsToPlunderGroup = computedEager<boolean>(() => {
    if (!groupInfo.value || !currentVillage.id) return false;
    return groupInfo.value.villages.has(currentVillage.id);
});

/** Indica se ataques devem ser enviados. */
const shouldAttack = computedEager<boolean>(() => {
    if (ares.captcha || !config.active || !plunderList) return false;
    if (config.groupAttack && !belongsToPlunderGroup.value) return false;
    return true;
});

// Reune informações necessárias para o funcionamento do Plunder.
await queryTemplateData();
queryTargetsInfo();
queryCurrentVillageInfo();

watch(() => config.groupAttack, (newValue) => updateGroupInfo(newValue, groupInfo));
watch(() => config.plunderGroupId, (newValue) => {
    if (!newValue) return;
    ipcInvoke('navigate-to-plunder-group');
});

watchEffect(() => {
    // Interrompe qualquer ataque em andamento.
    attackEventTarget.dispatchEvent(new Event('stop'));
    // Começa a atacar se o Plunder estiver ativado.
    if (config.active) {
        // Se a aldeia atual não pertencer ao grupo de saque, navega para alguma aldeia do grupo.
        if (config.groupAttack && !belongsToPlunderGroup.value) {
            ipcInvoke('navigate-to-next-plunder-village');
            return;
        };
        handleAttack();
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
        if ((Date.now() - info.lastAttack) > config.ignoreOlderThan * 3600000) continue;

        if (config.groupAttack && groupInfo.value) {
            const villageStatus = groupInfo.value.villages.getStrict(currentVillage.getId());
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
            assertElement(attackButton, `Could not find attack button for template ${best.type.toUpperCase()}.`);

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
                throw new PlunderError(`Attack using template ${best.type.toUpperCase()} could not be sent.`);
            };

            ipcSend('plunder-attack-sent', plunderAttack);
            targets.delete(id);
            village.remove();
            
            return handleAttack().catch(PlunderError.catch);
        };
    };

    // Caso, em toda tabela, não haja aldeia adequada para envio do ataque, verifica se há mais páginas.
    // Após acessar todas as páginas possíveis, navega para a próxima aldeia se o ataque em grupo estiver ativado.
    handleLackOfTargets(groupInfo.value);
};
</script>

<template>
    <PlunderReload :active="config.active" :minutesUntilReload="config.minutesUntilReload" />
</template>