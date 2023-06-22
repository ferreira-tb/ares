import { readonly, ref, toRef } from 'vue';
import { watchImmediate } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import { useUserAlias } from '$renderer/composables/user-alias';
import { decodeAlly } from '$common/utils';
import type { MaybeRefOrGetter } from 'vue';

export function useDiplomacy(userAlias: MaybeRefOrGetter<UserAlias | null> = useUserAlias()) {
    const diplomacy = ref<Diplomacy | null>(null);
    const userAliasRef = toRef(userAlias);
    
    watchImmediate(userAliasRef, async (alias) => {
        if (!alias) {
            diplomacy.value = null;
            return;
        }

        const raw = await ipcInvoke('game:fetch-diplomacy');
        if (!raw || Object.values(raw).every((value) => value.length === 0)) {
            diplomacy.value = null;
            return;
        }

        const [allies, nap, enemies] = await Promise.all([
            ipcInvoke('world-data:get-ally', raw.allies),
            ipcInvoke('world-data:get-ally', raw.nap),
            ipcInvoke('world-data:get-ally', raw.enemies)
        ]);

        diplomacy.value = {
            allies: allies.map(decodeAlly),
            nap: nap.map(decodeAlly),
            enemies: enemies.map(decodeAlly)
        };
    });

    return readonly(diplomacy);
}