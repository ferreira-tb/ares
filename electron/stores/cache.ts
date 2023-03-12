import { computed, ref, type Mechanus } from 'mechanus';
import { isString } from '@tb-dev/ts-guard';
import { generateUserAlias } from '$electron/utils/helpers';
import { worldRef, stringRef, objectOrNullRef } from '$electron/utils/mechanus';
import type { MechanusCacheStoreType, UserAlias } from '$types/electron';
import type { World } from '$types/game';
import type { DemolitionTemplateType } from '$types/plunder';

export function defineCacheStore(mechanus: Mechanus) {
    const world = ref<World | null>(null, worldRef);
    const player = ref<string | null>(null, stringRef);
    const userAlias = computed<UserAlias | null>([world, player], () => {
        if (!isString(player.value) || !isString(world.value)) return null;
        return generateUserAlias(world.value, player.value);
    });
    
    const demolitionTroops = ref<DemolitionTemplateType | null>(null, objectOrNullRef<DemolitionTemplateType>());

    return mechanus.define('cache', {
        world,
        player,
        userAlias,

        demolitionTroops
    } satisfies MechanusCacheStoreType);
};