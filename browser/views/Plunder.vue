<script setup lang="ts">
import { computed, provide, watchEffect } from 'vue';
import { patchPlunderStore, usePlunderStore } from '$vue/stores/plunder.js';
import { filterTemplates, queryTemplateData } from '$browser/farm/templates.js';
import { queryVillagesInfo, villagesInfo } from '$browser/farm/villages.js';
import { queryCurrentVillageCoords } from '$vue/helpers.js';
import { queryAvailableUnits } from '$browser/farm/units.js';
import { PlunderedResources } from '$browser/farm/resources.js';
import { prepareAttack, eventTarget as attackEventTarget } from '$browser/farm/attack.js';
import { assert, AresError } from '$global/error.js';
import { ipcInvoke, ipcSend } from '$global/ipc.js';
import { predictBestTemplate } from '$browser/farm/prediction.js';
import type { TemplateLoot } from '$browser/types.js';

const store = usePlunderStore();

/** EventTarget interno do componente. */
const eventTarget = new EventTarget();
/** Título da tabela. */
const plunderListTitle = document.queryAndAssert('div[id="am_widget_Farm" i] > h4:has(a)');

/** Indica se o Deimos pode fazer previsões. */
const canPredict = await ipcInvoke('can-predict-plunder');
/** Endpoint base para a API do Deimos. */
const endpoint = await ipcInvoke('deimos-endpoint');
provide('deimos-endpoint', endpoint);

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
queryTemplateData();
queryAvailableUnits();
queryVillagesInfo();

watchEffect(() => {
    // Interrompe qualquer ataque em andamento.
    attackEventTarget.dispatchEvent(new Event('stop'));

    // Começa a atacar se o Plunder estiver ativado.
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
        const style = village.getAttribute('style') ?? '';
        if (/display:\s*none/.test(style)) {
            village.remove();
            villagesInfo.delete(villageId);
            continue;
        };

        /** Informações sobre a aldeia. */
        const info = villagesInfo.assert(villageId);

        const templates = filterTemplates(info.res.total);
        if (templates.length === 0) continue;

        // Seleciona o modelo a partir do qual se espera obter mais recursos.
        // Se for impossível prever, usa o primeiro modelo da lista, que já foi previamente ordenada.
        // Além disso, se não houve previsão, considera que o modelo saqueará um valor igual sua capacidade de carga.
        const best: TemplateLoot = canPredict === true
            ? await predictBestTemplate(templates, info)
            : { template: templates[0], loot: templates[0].carry };

        const plunderedResources = new PlunderedResources(info, best.loot);

        if (best.template.type === 'a' || best.template.type === 'b') {
            const attackButton = info.button[best.template.type];
            assert(attackButton, `O botão do modelo ${best.template.type.toUpperCase()} não foi encontrado.`);

            return prepareAttack(plunderedResources, attackButton)
                .then(() => village.remove())
                .then(() => handleAttack())
                .catch((err: unknown) => AresError.handle(err));

        } else {
            // TODO: implementar ataque com modelos personalizados.
            continue;
        };
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