import { effectScope, readonly, ref, toRef } from 'vue';
import { tryOnScopeDispose, watchImmediate } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables/ipc';
import { useUserAlias } from '$renderer/composables/user-alias';
import { RendererProcessError } from '$renderer/error';
import { decodeVillageGroups } from '$common/utils';
import type { MaybeRefOrGetter } from 'vue';

interface UseGroupsOptions {
    readonly type?: 'static' | 'dynamic';
}

export function useGroups(
    userAlias: MaybeRefOrGetter<UserAlias | null> = useUserAlias(),
    options?: UseGroupsOptions
) {
    const scope = effectScope();
    const groups = ref<VillageGroup[]>([]);
    const userAliasRef = toRef(userAlias);

    scope.run(() => {
        useIpcOn('game:did-update-village-groups', (_e, newGroups: VillageGroup[]) => {
            groups.value = decodeVillageGroups(newGroups);
        });

        watchImmediate(userAliasRef, async (alias) => {
            try {
                if (alias === null) {
                    groups.value = [];
                    return;
                }
    
                let value = await ipcInvoke('game:get-all-village-groups');
                if (options?.type) {
                    value = value.filter((group) => group.type === options.type);
                }

                groups.value = decodeVillageGroups(value);
    
            } catch (err) {
                RendererProcessError.catch(err);
                groups.value = [];
            }
        });
    });

    async function refetch() {
        const didFetch = await ipcInvoke('game:fetch-village-groups');
        if (!didFetch) throw new RendererProcessError('Failed to fetch village groups');
    }

    tryOnScopeDispose(() => scope.stop());

    return {
        groups: readonly(groups),
        refetch
    };
}