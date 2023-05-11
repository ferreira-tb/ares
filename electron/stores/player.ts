import { ref } from 'mechanus';
import { integerOrNullRef, stringOrNullRef } from '$electron/utils/mechanus';

export function definePlayerStore(mechanus: Mechanus) {
    return mechanus.define('player', {
        name: ref<string | null>(null, stringOrNullRef),
        id: ref<number | null>(null, integerOrNullRef),
        points: ref<number | null>(null, integerOrNullRef),
        villageAmount: ref<number | null>(null, integerOrNullRef)
    } satisfies MechanusPlayerStoreType);
};