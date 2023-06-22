import { readonly, ref, toRef } from 'vue';
import { watchImmediate } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import { useUserAlias } from '$renderer/composables';
import { RendererProcessError } from '$renderer/error';
import type { MaybeRefOrGetter } from 'vue';

/**
 * Indica se o mundo possui arqueiros.
 * Se não houver um mundo ativo, seu valor será `null`.
 */
export function useArcherWorld(userAlias: MaybeRefOrGetter<UserAlias | null> = useUserAlias()) {
    const isArcherWorld = ref<boolean | null>(null);
    const userAliasRef = toRef(userAlias);

    watchImmediate(userAliasRef, async (alias) => {
        try {
            if (alias === null) {
                isArcherWorld.value = null;
                return;
            }

            const value = await ipcInvoke('world:is-archer-world');
            isArcherWorld.value = value;

        } catch (err) {
            RendererProcessError.catch(err);
            isArcherWorld.value = null;
        }
    });

    return readonly(isArcherWorld);
}