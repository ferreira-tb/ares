import { effectScope, readonly, ref } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';
import { RendererProcessError } from '$renderer/error';

export function useBrowserTab(tabId: number) {
    const scope = effectScope();

    const title = ref<string | null>(null);
    const favicon = ref<string | null>(null);
    const isLoading = ref<boolean>(false);

    ipcInvoke('tab:title', tabId).then(
        (tabTitle) => (title.value = tabTitle),
        (err: unknown) => RendererProcessError.catch(err)
    );

    scope.run(() => {
        useIpcOn('tab:loading-status', (_e, loadingTabId: number, status: boolean) => {
            if (tabId !== loadingTabId) return;
            isLoading.value = status;
        });

        useIpcOn('tab:did-update-title', (_e, updatedTabId: number, newTitle: string) => {
            if (tabId !== updatedTabId) return;
            title.value = newTitle;
        });
        
        useIpcOn('tab:did-update-favicon', (_e, updatedTabId: number, newFavicon: string) => {
            if (tabId !== updatedTabId) return;
            favicon.value = newFavicon;
        });
    });

    tryOnScopeDispose(() => scope.stop());

    return {
        title: readonly(title),
        favicon: readonly(favicon),
        isLoading: readonly(isLoading)
    };
};