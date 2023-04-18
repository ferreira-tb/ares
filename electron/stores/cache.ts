import { computed, ref, type Mechanus } from 'mechanus';
import { isString } from '$global/guards';
import { generateUserAlias } from '$electron/utils/helpers';
import { worldRef, stringRef } from '$electron/utils/mechanus';
import type { UserAlias } from '$types/electron';
import type { MechanusCacheStoreType } from '$types/stores';
import type { World } from '$types/game';

export function defineCacheStore(mechanus: Mechanus) {
    const world = ref<World | null>(null, worldRef);
    const player = ref<string | null>(null, stringRef);
    const userAlias = computed<UserAlias | null>([world, player], () => {
        if (!isString(player.value) || !isString(world.value)) return null;
        return generateUserAlias(world.value, player.value);
    });
    
    return mechanus.define('cache', {
        world,
        player,
        userAlias
    } satisfies MechanusCacheStoreType);
};