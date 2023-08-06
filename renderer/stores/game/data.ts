import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useGameDataStore = defineStore('game-data', () => {
    const locale = ref<string | null>(null);
    const world = ref<World | null>(null);
    const majorVersion = ref<string | null>(null);
    
    const screen = ref<string | null>(null);
    const screenMode = ref<string | null>(null);
    const pregame = ref<boolean | null>(null);
    const groupId = ref<number | null>(null);

    const features = ref<TribalWarsGameDataType['features']>({
        premium: null,
        accountManager: null,
        farmAssistant: null
    });

    const player = ref<TribalWarsGameDataType['player']>({
        name: null,
        id: null,
        points: 0,
        villageAmount: 0,
        ally: 0
    });

    const village = ref<TribalWarsGameDataType['village']>({
        x: null,
        y: null,
        id: null,
        name: null,
        population: null,
        maxPopulation: null,
        points: null,
        wood: null,
        stone: null,
        iron: null,
        maxStorage: null
    });

    function getVillageId() {
        if (typeof village.value.id !== 'number' || !Number.isInteger(village.value.id)) {
            throw new TypeError(`${village.value.id} is not a valid village id.`);
        }

        return village.value.id;
    }

    function useCoords() {
        return computed<[number | null, number | null]>(() => {
            return [village.value.x, village.value.y];
        });
    }

    function useTotalResources() {
        return computed<number | null>(() => {
            if (village.value.wood === null) return null;
            if (village.value.stone === null) return null;
            if (village.value.iron === null) return null;
            return village.value.wood + village.value.stone + village.value.iron;
        });
    }

    return {
        locale,
        world,
        majorVersion,
        
        screen,
        screenMode,
        pregame,
        groupId,

        features,
        player,
        village,

        getVillageId,
        useCoords,
        useTotalResources
    } satisfies PiniaGameDataStoreType;
});