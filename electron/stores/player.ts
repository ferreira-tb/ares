import { ref } from 'mechanus';

export function definePlayerStore(mechanus: Mechanus) {
    return mechanus.define('player', () => {
        const name = ref<string | null>(null);
        const id = ref<number | null>(null);
        const points = ref<number>(0);
        const villageAmount = ref<number>(0);

        return {
            name,
            id,
            points,
            villageAmount
        } satisfies MechanusPlayerStoreType;
    });
};