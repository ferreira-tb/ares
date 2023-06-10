import { ref } from 'mechanus';

export function definePlayerStore(mechanus: Mechanus) {
    return mechanus.define('player', {
        name: ref<string | null>(null),
        id: ref<number | null>(null),
        points: ref<number>(0),
        villageAmount: ref<number>(0)
    } satisfies MechanusPlayerStoreType);
};