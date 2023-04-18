import { ref } from 'mechanus';
import { Kronos } from '$global/constants';
import { isInteger, isFiniteNumber } from '$global/guards';
import type { WallLevel } from '$types/game';
import type { Mechanus, MechanusRefOptions } from 'mechanus';

import {
    integerRef,
    booleanRef,
    positiveIntegerRef,
    positiveNumberRef,
    arrayIncludesRef,
    wallLevelRef,
    positiveIntegerOrNullRef,
    integerOrNullRef
} from '$electron/utils/mechanus';

import type {
    BlindAttackPattern,
    UseCPattern,
    PlunderPageListType,
    DemolitionTemplateType,
    PlunderGroupType
} from '$types/plunder';

import type {
    MechanusPlunderStoreType,
    MechanusPlunderConfigStoreType,
    MechanusPlunderHistoryStoreType,
    MechanusPlunderCacheStoreType
} from '$types/stores';

export function definePlunderStore(mechanus: Mechanus) {
    return mechanus.define('plunder', {
        hideAttacked: ref<boolean>(true, booleanRef),
        page: ref<number>(0, integerRef),
        pageSize: ref<number | null>(null, integerOrNullRef),
        plunderExhausted: ref<boolean>(false, booleanRef)
    } satisfies MechanusPlunderStoreType);
};

// Patterns.
const blindAttackPatterns: BlindAttackPattern[] = ['smaller', 'bigger'];
const useCPatterns: UseCPattern[] = ['excess', 'normal', 'only'];

export function definePlunderConfigStore(mechanus: Mechanus) {
    const finiteValidator = (min: number, max: number | null = null): MechanusRefOptions<number> => {
        const refOptions = { ...positiveNumberRef };
        refOptions.validator = (value: unknown): value is number => {
            if (max) return isFiniteNumber(value) && value >= min && value <= max;
            return isFiniteNumber(value) && value >= min;
        };
        return refOptions;
    };

    const integerValidator = (min: number, max: number | null = null): MechanusRefOptions<number> => {
        const refOptions = { ...positiveIntegerRef };
        refOptions.validator = (value: unknown): value is number => {
            if (max) return isInteger(value) && value >= min && value <= max;
            return isInteger(value) && value >= min;
        };
        return refOptions;
    };

    // Painel
    const active = ref<boolean>(false, booleanRef);
    const ignoreWall = ref<boolean>(false, booleanRef);
    const destroyWall = ref<boolean>(false, booleanRef);
    const groupAttack = ref<boolean>(false, booleanRef);
    const useC = ref<boolean>(false, booleanRef);
    const ignoreDelay = ref<boolean>(false, booleanRef);
    const blindAttack = ref<boolean>(false, booleanRef);

    // Ataque
    const maxDistance = ref<number>(20, finiteValidator(1));
    const ignoreOlderThan = ref<number>(10, positiveIntegerRef);
    const attackDelay = ref<number>(200, integerValidator(100, Kronos.Minute));
    const resourceRatio = ref<number>(0.8, finiteValidator(0.2, 1));
    const blindAttackPattern = ref<BlindAttackPattern>('smaller', arrayIncludesRef(blindAttackPatterns));

    // Modelo C
    const useCPattern = ref<UseCPattern>('normal', arrayIncludesRef(useCPatterns));
    const maxDistanceC = ref<number>(10, finiteValidator(1));
    const ignoreOlderThanC = ref<number>(5, positiveIntegerRef);
    const useCWhenResourceRatioIsBiggerThan = ref<number>(1.5, finiteValidator(1));

    // Grupo
    const plunderGroupId = ref<number | null>(null, positiveIntegerOrNullRef);
    const fieldsPerWave = ref<number>(10, finiteValidator(5));
    const villageDelay = ref<number>(2000, integerValidator(100, Kronos.Minute));

    // Muralha
    const wallLevelToIgnore = ref<WallLevel>(1, wallLevelRef);
    const wallLevelToDestroy = ref<WallLevel>(1, wallLevelRef);
    const destroyWallMaxDistance = ref<number>(20, finiteValidator(1));
    
    // Outros
    const minutesUntilReload = ref<number>(10, integerValidator(1, 60));
    const plunderedResourcesRatio = ref<number>(1, finiteValidator(0.2, 1));
    const pageDelay = ref<number>(2000, integerValidator(100, Kronos.Minute));
    
    return mechanus.define('plunderConfig', {
        active,
        ignoreWall,
        destroyWall,
        groupAttack,
        useC,
        ignoreDelay,
        blindAttack,

        maxDistance,
        ignoreOlderThan,
        attackDelay,
        resourceRatio,
        blindAttackPattern,

        useCPattern,
        maxDistanceC,
        ignoreOlderThanC,
        useCWhenResourceRatioIsBiggerThan,

        plunderGroupId,
        fieldsPerWave,
        villageDelay,

        wallLevelToIgnore,
        wallLevelToDestroy,
        destroyWallMaxDistance,
        
        minutesUntilReload,
        plunderedResourcesRatio,
        pageDelay
    } satisfies MechanusPlunderConfigStoreType);
};

export function setPlunderHistoryStores(mechanus: Mechanus) {
    const useLastPlunderHistoryStore = mechanus.define('lastPlunderHistory', {
        wood: ref<number>(0, positiveIntegerRef),
        stone: ref<number>(0, positiveIntegerRef),
        iron: ref<number>(0, positiveIntegerRef),
        total: ref<number>(0, positiveIntegerRef),
        destroyedWalls: ref<number>(0, positiveIntegerRef),
        attackAmount: ref<number>(0, positiveIntegerRef)
    } satisfies MechanusPlunderHistoryStoreType);

    const useTotalPlunderHistoryStore = mechanus.define('totalPlunderHistory', {
        wood: ref<number>(0, positiveIntegerRef),
        stone: ref<number>(0, positiveIntegerRef),
        iron: ref<number>(0, positiveIntegerRef),
        total: ref<number>(0, positiveIntegerRef),
        destroyedWalls: ref<number>(0, positiveIntegerRef),
        attackAmount: ref<number>(0, positiveIntegerRef)
    } satisfies MechanusPlunderHistoryStoreType);

    return {
        useLastPlunderHistoryStore,
        useTotalPlunderHistoryStore
    };
};

export function definePlunderCacheStore(mechanus: Mechanus) {
    return mechanus.define('plunderCache', {
        pages: ref<PlunderPageListType | null>(null),
        plunderGroup: ref<PlunderGroupType | null>(null),
        demolitionTroops: ref<DemolitionTemplateType | null>(null)
    } satisfies MechanusPlunderCacheStoreType);
};