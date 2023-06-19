import { effectScope, readonly, ref, toRef, toValue, watchEffect, type MaybeRefOrGetter } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables/ipc';
import { useUserAlias } from '$renderer/composables/user-alias';
import { RendererProcessError } from '$renderer/error';
import { decodeVillageGroups } from '$common/utils';

export function useGroups(userAlias: MaybeRefOrGetter<UserAlias | null> = useUserAlias()) {
    const scope = effectScope();
    const groups = ref(new Set<VillageGroup>());
    const userAliasRef = toRef(userAlias);

    scope.run(() => {
        useIpcOn('game:did-update-village-groups-set', (_e, newGroups: Set<VillageGroup>) => {
            groups.value = decodeVillageGroups(newGroups);
        });

        watchEffect(async () => {
            const alias = toValue(userAliasRef);
            try {
                if (alias === null) {
                    groups.value = new Set();
                    return;
                };
    
                const value = await ipcInvoke('game:get-all-village-groups');
                groups.value = decodeVillageGroups(value);
    
            } catch (err) {
                RendererProcessError.catch(err);
                groups.value = new Set();
            };
        });
    });

    tryOnScopeDispose(() => scope.stop());

    return readonly(groups);
};