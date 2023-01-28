<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { patchPlunderStore, usePlunderStore } from '@/stores/plunder.js';
import { queryModelData, attackModel, resources } from '$/farm/models.js';
import { queryVillagesInfo, villagesInfo } from '$/farm/villages.js';
import { queryCurrentVillageCoords } from '$/helpers.js';
import { queryAvailableUnits } from '$/farm/units.js';
import { ExpectedResources } from '$/farm/resources.js';
import { prepareAttack, eventTarget as attackEventTarget } from '$/farm/attack.js';
import { assert, ClaustrophobicError } from '#/error.js';
import { ipcSend } from '#/ipc.js';

const store = usePlunderStore();

/** EventTarget interno do componente. */
const eventTarget = new EventTarget();
/** Título da tabela. */
const plunderListTitle = document.queryAndAssert('div[id="am_widget_Farm" i] > h4:has(a)');
/** Milisegundos entre cada recarregamento automático da página. */
const plunderTimeout = computed(() => store.minutesUntilReload * 60000);
/** Data do próximo recarregamento automático. */
const nextAutoReload = computed(() => {
    if (store.status === false) return null;
    return new Date(Date.now() + plunderTimeout.value);
});

const autoReloadMessage = computed(() => {
    if (nextAutoReload.value === null) return null;
    const date = nextAutoReload.value.toLocaleDateString('pt-br', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = nextAutoReload.value.toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' });
    return `A página será recarregada automaticamente em ${date} às ${time}`;
});

// Atualiza a store do Plunder com os valores salvos no armazenamento.
await patchPlunderStore();

// Reune informações necessárias para o funcionamento do Plunder.
queryCurrentVillageCoords();
queryModelData();
queryAvailableUnits();
queryVillagesInfo();

watchEffect(() => {
    attackEventTarget.dispatchEvent(new Event('stop'));

    if (store.status === true) {
        handleAttack();
        setPlunderTimeout();
    } else {
        eventTarget.dispatchEvent(new Event('cancelreload'));
    };
});

async function handleAttack(): Promise<void> {
    if (store.status === false) return;

    // Seleciona todas as aldeias da tabela.
    const plunderList = document.queryAndAssert('#plunder_list:has(tr[id^="village"]) tbody');
    const villages = plunderList.queryAsArray<HTMLTableRowElement>('tr[data-tb-village]');

    for (const village of villages) {
        const villageId = village.assertAttribute('data-tb-village');

        // Ignora a linha caso ela esteja oculta, removendo-a da tabela.
        if (village.getAttribute('style')?.includes('display: none')) {
            village.remove();
            villagesInfo.delete(villageId);
            continue;
        };

        /** Informações sobre a aldeia. */
        const info = villagesInfo.assert(villageId);
        resources.value = info.total;

        if (attackModel.value === null) continue;

        const expectedResources = new ExpectedResources(info, attackModel.value.carry);
        const attackButton = info[attackModel.value.type];
        assert(attackButton, `O botão do modelo ${attackModel.value.type.toUpperCase()} não foi encontrado.`);

        return prepareAttack(expectedResources, attackButton)
            .then(() => village.remove())
            .then(() => handleAttack())
            .catch((err: unknown) => ClaustrophobicError.handle(err));
    };
};

function setPlunderTimeout() {
    return new Promise<void>((resolve) => {
        const autoReloadCtrl = new AbortController();

        const timeout = setTimeout(() => {
            autoReloadCtrl.abort();
            setTimeout(() => ipcSend('reload-main-window'), 5000);
            resolve();
        }, plunderTimeout.value);

        eventTarget.addEventListener('cancelreload', () => {
            clearTimeout(timeout);
            autoReloadCtrl.abort();
            resolve();
        }, { signal: autoReloadCtrl.signal });
    });
};
</script>

<template>
    <Teleport :to="plunderListTitle">
        <Transition name="tb-fade" mode="out-in">
            <span v-if="store.status && autoReloadMessage" class="auto-reload-message">{{ autoReloadMessage }}</span>
        </Transition>
    </Teleport>
</template>

<style scoped>
.auto-reload-message {
    font-style: normal;
    position: absolute;
    right: 10px;
}
</style>