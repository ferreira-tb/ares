<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useEventListener } from '@vueuse/core';
import { ipcSend } from '$global/ipc';
import ReloadMessage from '$browser/components/plunder/ReloadMessage.vue';

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
const plunderTimeout = ref<number>(props.minutesUntilReload * 60000);

watchEffect(() => {
    eventTarget.dispatchEvent(new Event('cancelreload'));
    plunderTimeout.value = props.minutesUntilReload * 60000;
    if (props.active === true) setPlunderTimeout();
});

function setPlunderTimeout() {
    return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => reloadMainView(), plunderTimeout.value);
        const cleanup = useEventListener(eventTarget, 'cancelreload', cancel);

        function cancel() {
            clearTimeout(timeout);
            cleanup();
            resolve();
        };
    });
};

function reloadMainView() {
    ipcSend('update-plunder-cache-village-info', null);
    ipcSend('update-plunder-cache-group-info', null);
    ipcSend('reload-main-view');
};
</script>

<template>
    <Teleport :to="plunderListTitle">
        <Transition name="tb-fade" mode="out-in">
            <ReloadMessage :active="props.active" :plunderTimeout="plunderTimeout" />
        </Transition>
    </Teleport>
</template>
