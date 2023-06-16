import { effectScope, readonly, ref } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';
import { RendererProcessError } from '$renderer/error';

export function usePanelVisibility() {
    const scope = effectScope();
    const isVisible = ref<boolean>(false);

    ipcInvoke('panel:is-visible').then(
        (status) => (isVisible.value = status),
        (err: unknown) => RendererProcessError.catch(err)
    );

    scope.run(() => {
        useIpcOn('panel:visibility-did-change', (_e, status: boolean) => {
            isVisible.value = status;
        });
    });

    tryOnScopeDispose(() => scope.stop());

    const toggle = () => ipcSend('panel:toggle');
    return { isVisible: readonly(isVisible), toggle };
};