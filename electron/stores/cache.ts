import { computed, ref } from 'mechanus';
import { isString } from '$shared/guards';
import { generateUserAlias } from '$electron/utils/helpers';
import { gameRegionRef, worldRef, stringRef } from '$electron/utils/mechanus';

export function defineCacheStore(mechanus: Mechanus) {
    const region = ref<GameRegion>('br', gameRegionRef);
    const world = ref<World | null>(null, worldRef);
    const player = ref<string | null>(null, stringRef);
    const userAlias = computed<UserAlias | null>([world, player], () => {
        if (!isString(player.value) || !isString(world.value)) return null;
        return generateUserAlias(world.value, player.value);
    });
    
    return mechanus.define('cache', {
        region,
        world,
        player,
        userAlias
    } satisfies MechanusCacheStoreType);
};