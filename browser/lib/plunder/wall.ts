import { useUnitsStore } from '$vue/stores/units.js';

export async function destroyWall(): Promise<boolean> {
    const unitStore = useUnitsStore();
    return !unitStore;
};