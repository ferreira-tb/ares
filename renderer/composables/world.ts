import { readonly, ref } from 'vue';
import { watchImmediate } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import { useUserAlias } from '$renderer/composables';
import { RendererProcessError } from '$renderer/error';

/**
 * Indica se o mundo possui arqueiros.
 * Se não houver um mundo ativo, seu valor será `null`.
 */
export function useArcherWorld() {
    const userAlias = useUserAlias();
    const isArcherWorld = ref<boolean | null>(null);

    watchImmediate(userAlias, async (alias) => {
        try {
            if (alias === null) {
                isArcherWorld.value = null;
                return;
            };

            const value = await ipcInvoke('world:is-archer-world');
            isArcherWorld.value = value;

        } catch (err) {
            RendererProcessError.catch(err);
            isArcherWorld.value = null;
        };
    });

    return readonly(isArcherWorld);
};