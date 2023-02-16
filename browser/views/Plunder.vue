<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useEventListener } from '@vueuse/core';
import { assertElement } from '@tb-dev/ts-guard-dom';
import { patchPlunderConfigStore, usePlunderConfigStore } from '$vue/stores/plunder.js';
import { filterTemplates, pickBestTemplate, queryTemplateData } from '$lib/farm/templates.js';
import { queryVillagesInfo, villagesInfo } from '$lib/farm/villages.js';
import { queryAvailableUnits } from '$lib/farm/units.js';
import { PlunderedResources } from '$lib/farm/resources.js';
import { prepareAttack, eventTarget as attackEventTarget } from '$lib/farm/attack.js';
import { AresError } from '$global/error.js';
import { ipcSend } from '$global/ipc.js';

const config = usePlunderConfigStore();

/** EventTarget interno do componente. */
const eventTarget = new EventTarget();
/** Título da tabela. */
const plunderListTitle = document.queryAndAssert('div[id="am_widget_Farm" i] > h4:has(a)');
/** Tabela do assistente de saque. */
const plunderList = document.queryAndAssert('#plunder_list:has(tr[id^="village"]) tbody');

/** Milisegundos entre cada recarregamento automático da página. */
const plunderTimeout = computed(() => config.minutesUntilReload * 60000);
/** Data do próximo recarregamento automático. */
const nextAutoReload = computed(() => {
    if (config.active === false) return null;
    return new Date(Date.now() + plunderTimeout.value);
});

const autoReloadMessage = computed(() => {
    if (nextAutoReload.value === null) return null;
    const date = nextAutoReload.value.toLocaleDateString('pt-br', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = nextAutoReload.value.toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' });
    return `A página será recarregada automaticamente em ${date} às ${time}`;
});

// Atualiza a store do Plunder com os valores salvos no armazenamento.
await patchPlunderConfigStore();

// Reune informações necessárias para o funcionamento do Plunder.
queryTemplateData();
queryAvailableUnits();
queryVillagesInfo();

watchEffect(() => {
    // Interrompe qualquer ataque em andamento.
    attackEventTarget.dispatchEvent(new Event('stop'));

    // Começa a atacar se o Plunder estiver ativado.
    if (config.active === true) {
        handleAttack();
        setPlunderTimeout();
    } else {
        eventTarget.dispatchEvent(new Event('cancelreload'));
    };
});

async function handleAttack(): Promise<void> {
    if (config.active === false) return;

    // Seleciona todas as aldeias da tabela e itera sobre elas.
    const villages = plunderList.queryAsMap('tr[data-tb-village]', (e) => e.getAttributeStrict('data-tb-village'));
    for (const [id, village] of villages.entries()) {
        // Ignora a linha caso ela esteja oculta, removendo-a da tabela.
        const style = village.getAttribute('style') ?? '';
        if (/display:\s*none/.test(style)) {
            village.remove();
            villagesInfo.delete(id);
            continue;
        };

        // Ignora a linha caso a aldeia esteja sob ataque.
        const attackIcon = village.querySelector('img[src*="attack.png" i]');
        if (attackIcon !== null) {
            villagesInfo.delete(id);
            continue;
        };

        /** Informações sobre a aldeia. */
        const info = villagesInfo.getStrict(id);

        const templates = await filterTemplates(info.res.total);
        if (templates.length === 0) continue;

        // Seleciona o modelo com a maior capacidade de carga.
        const best = pickBestTemplate(templates);

        // Informações que serão enviadas ao painel.
        const plunderedResources = new PlunderedResources(info, best.carry);

        if (best.type === 'a' || best.type === 'b') {
            const attackButton = info.button[best.type];
            assertElement(attackButton, `O botão do modelo ${best.type.toUpperCase()} não foi encontrado.`);

            return prepareAttack(plunderedResources, attackButton)
                .then(() => villagesInfo.delete(id))
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
        const timeout = setTimeout(() => ipcSend('reload-browser-window'), plunderTimeout.value);
        const cleanup = useEventListener(eventTarget, 'cancelreload', cancel);

        function cancel() {
            clearTimeout(timeout);
            cleanup();
            resolve();
        };
    });
};
</script>

<template>
    <Teleport :to="plunderListTitle">
        <Transition name="tb-fade" mode="out-in">
            <span v-if="config.active && autoReloadMessage" class="auto-reload-message">{{ autoReloadMessage }}</span>
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