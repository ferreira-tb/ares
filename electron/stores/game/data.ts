import { ref } from 'mechanus';

export function defineGameDataStore(mechanus: Mechanus) {
    return mechanus.define('game-data', () => {
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
            village
        } satisfies MechanusGameDataStoreType;
    });
};