import { computed, ref } from 'mechanus';
import { isString } from '$common/guards';
import { generateUserAlias } from '$electron/utils/helpers';

export function defineCacheStore(mechanus: Mechanus) {
    const region = ref<GameRegion>('br');
    const world = ref<World | null>(null);
    const player = ref<string | null>(null);
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