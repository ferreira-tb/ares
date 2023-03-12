import { ref, type Mechanus } from 'mechanus';
import { stringOrNullRef, worldOrNullRef, booleanOrNullRef } from '$electron/utils/mechanus';
import type { World } from '$types/game';
import type { MechanusAresStoreType } from '$types/stores';

export function defineAresStore(mechanus: Mechanus) {
    return mechanus.define('ares', {
        locale: ref<string | null>(null, stringOrNullRef),
        world: ref<World | null>(null, worldOrNullRef),
        majorVersion: ref<string | null>(null, stringOrNullRef),

        screen: ref<string | null>(null, stringOrNullRef),
        screenMode: ref<string | null>(null, stringOrNullRef),
        pregame: ref<boolean | null>(null, booleanOrNullRef)
    } satisfies MechanusAresStoreType);
};