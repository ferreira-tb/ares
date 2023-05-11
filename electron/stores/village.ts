import { computed, ref } from 'mechanus';
import { integerOrNullRef, stringOrNullRef } from '$electron/utils/mechanus';

export function defineCurrentVillageStore(mechanus: Mechanus) {
    const x = ref<number | null>(null, integerOrNullRef);
    const y = ref<number | null>(null, integerOrNullRef);
    const id = ref<number | null>(null, integerOrNullRef);
    const name = ref<string | null>(null, stringOrNullRef);
    const population = ref<number | null>(null, integerOrNullRef);
    const maxPopulation = ref<number | null>(null, integerOrNullRef);
    const points = ref<number | null>(null, integerOrNullRef);
    const wood = ref<number | null>(null, integerOrNullRef);
    const stone = ref<number | null>(null, integerOrNullRef);
    const iron = ref<number | null>(null, integerOrNullRef);
    const maxStorage = ref<number | null>(null, integerOrNullRef);

    const coords: MechanusComputedRef<[number | null, number | null]> = computed([x, y], () => [x.value, y.value]);
    const totalResources = computed([wood, stone, iron], () => {
        if (wood.value === null) return null;
        if (stone.value === null) return null;
        if (iron.value === null) return null;
        return wood.value + stone.value + iron.value;
    });

    return mechanus.define('current-village', {
        x,
        y,
        id,
        name,
        population,
        maxPopulation,
        points,
        wood,
        stone,
        iron,
        maxStorage,
        coords,
        totalResources
    } satisfies MechanusCurrentVillageStoreType);
};