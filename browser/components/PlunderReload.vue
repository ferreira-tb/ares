<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useEventListener } from '@vueuse/core';
import { NCountdown } from 'naive-ui';
import { Kronos } from '@tb-dev/kronos';
import { ipcSend } from '$renderer/ipc';
import { PlunderError } from '$browser/error';

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

const duration = computed(() => {
    if (!props.active) return 0;
    return plunderTimeout.value;
});

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
        <span class="auto-reload-message">
            <Transition name="tb-fade" mode="out-in">
                <span v-if="props.active">
                    <span class="auto-reload-label">Próxima atualização:</span>
                    <NCountdown :duration="duration" />
                </span>
            </Transition>
        </span>
    </Teleport>
</template>

<style scoped lang="scss">
.auto-reload-message {
    font-style: normal;
    position: absolute;
    right: 1em;

    .auto-reload-label {
        margin-right: 0.3em;
    }
}
</style>