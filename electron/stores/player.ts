import { ref, type Mechanus } from 'mechanus';
import { integerOrNullRef, stringOrNullRef } from '$electron/utils/mechanus';
import { MechanusPlayerStoreType } from '$types/stores';

export function definePlayerStore(mechanus: Mechanus) {
    return mechanus.define('player', {
        name: ref<string | null>(null, stringOrNullRef),
        id: ref<number | null>(null, integerOrNullRef),
        points: ref<number | null>(null, integerOrNullRef),
        villageAmount: ref<number | null>(null, integerOrNullRef)
    } satisfies MechanusPlayerStoreType);
};