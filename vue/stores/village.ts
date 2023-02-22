import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { PiniaCurrentVillageStore } from '$types/stores.js';

export const useCurrentVillageStore = defineStore('current-village', () => {
    const x = ref<number | null>(null);
    const y = ref<number | null>(null);
    const id = ref<number | null>(null);
    const name = ref<string | null>(null);
    const population = ref<number | null>(null);
    const maxPopulation = ref<number | null>(null);
    const points = ref<number | null>(null);
    const wood = ref<number | null>(null);
    const stone = ref<number | null>(null);
    const iron = ref<number | null>(null);
    const maxStorage = ref<number | null>(null);

    const coords = computed(() => [x.value, y.value]);
    const totalResources = computed(() => {
        if (wood.value === null) return null;
        if (stone.value === null) return null;
        if (iron.value === null) return null;
        return wood.value + stone.value + iron.value;
    });

    return {
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
    } satisfies PiniaCurrentVillageStore;
});