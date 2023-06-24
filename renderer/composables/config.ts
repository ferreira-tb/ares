import { effectScope, readonly, ref } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables/ipc';
import { RendererProcessError } from '$renderer/error';

export function useTagsConfig() {
    const scope = effectScope();
    const tagsConfig = ref<TagsConfigType | null>(null);

    ipcInvoke('config:get', 'tags')
        .then((config) => (tagsConfig.value = config))
        .catch(RendererProcessError.catch);

    scope.run(() => {
        useIpcOn('config:did-update', async (_e, configType: keyof AppConfigType) => {
            if (configType === 'tags') {
                try {
                    const config = await ipcInvoke('config:get', configType);
                    tagsConfig.value = config;
                } catch (err) {
                    RendererProcessError.catch(err);
                }
            }
        });
    });

    tryOnScopeDispose(() => scope.stop());

    return readonly(tagsConfig);
}