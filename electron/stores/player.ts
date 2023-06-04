import { ref } from 'mechanus';
import { integerRef, integerOrNullRef, stringOrNullRef } from '$electron/utils/mechanus';

export function definePlayerStore(mechanus: Mechanus) {
    return mechanus.define('player', {
        name: ref<string | null>(null, stringOrNullRef),
        id: ref<number | null>(null, integerOrNullRef),
        points: ref<number>(0, integerRef),
        villageAmount: ref<number>(0, integerRef)
    } satisfies MechanusPlayerStoreType);
};