<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useEventListener } from '@vueuse/core';
import { ipcSend } from '$renderer/ipc';
import { PlunderError } from '$browser/error';
import { Kronos } from '@tb-dev/kronos';
import PlunderReloadMessage from '$browser/components/PlunderReloadMessage.vue';

const props = defineProps<{
    /** Indica se o Plunder está ativo. */
    active: boolean;
    /** Minutos até que a página seja recarregada automaticamente. */
    minutesUntilReload: number;
}>();

/** EventTarget interno do componente. */
const eventTarget = new EventTarget();
/** Título da tabela. */
const plunderListTitle = document.queryAndAssert('div[id="am_widget_Farm" i] > h4:has(a)');
/** Milisegundos entre cada recarregamento automático da página. */
const plunderTimeout = ref<number>(props.minutesUntilReload * Kronos.Minute);

watchEffect(() => {
    eventTarget.dispatchEvent(new Event('cancelreload'));
    plunderTimeout.value = props.minutesUntilReload * Kronos.Minute;
    if (props.active) setPlunderTimeout().catch(PlunderError.catch);
});

function setPlunderTimeout() {
    return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => reloadMainView(), plunderTimeout.value);
        const cleanup = useEventListener(eventTarget, 'cancelreload', () => {
            clearTimeout(timeout);
            cleanup();
            resolve();
        });
    });
};

function reloadMainView() {
    ipcSend('plunder:update-pages-info', null);
    ipcSend('plunder:update-group-info', null);
    ipcSend('main-tab:reload');
};
</script>

<template>
    <Teleport :to="plunderListTitle">
        <Transition name="tb-fade" mode="out-in">
            <Suspense>
                <PlunderReloadMessage :active="props.active" :plunder-timeout="plunderTimeout" />
            </Suspense>
        </Transition>
    </Teleport>
</template>
