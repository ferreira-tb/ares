import { ref } from 'mechanus';
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
const useCPatterns: UseCPattern[] = ['normal', 'only'];

export function definePlunderConfigStore(mechanus: Mechanus) {
    const delayValidator = (): MechanusRefOptions<number> => {
        const refOptions = { ...positiveIntegerRef };
        refOptions.validator = (value: unknown): value is number => {
            return isInteger(value) && value >= 100 && value <= 60000;
        };
        return refOptions;
    };

    const ratioValidator = (): MechanusRefOptions<number> => {
        const refOptions = { ...positiveNumberRef };
        refOptions.validator = (value: unknown): value is number => {
            return isFiniteNumber(value) && value >= 0.2 && value <= 1;
        };
        return refOptions;
    };

    const minutesUntilReloadValidator = (): MechanusRefOptions<number> => {
        const refOptions = { ...positiveIntegerRef };
        refOptions.validator = (value: unknown): value is number => {
            return isInteger(value) && value >= 1 && value <= 60;
        };
        return refOptions;
    };

    const maxDistanceValidator = (min: number = 1): MechanusRefOptions<number> => {
        const refOptions = { ...positiveNumberRef };
        refOptions.validator = (value: unknown): value is number => {
            return isFiniteNumber(value) && value >= min;
        };
        return refOptions;
    };

    const active = ref<boolean>(false, booleanRef);

    const ignoreWall = ref<boolean>(false, booleanRef);
    const destroyWall = ref<boolean>(false, booleanRef);
    const groupAttack = ref<boolean>(false, booleanRef);
    const useC = ref<boolean>(false, booleanRef);
    const ignoreDelay = ref<boolean>(false, booleanRef);
    const blindAttack = ref<boolean>(false, booleanRef);

    const wallLevelToIgnore = ref<WallLevel>(1, wallLevelRef);
    const wallLevelToDestroy = ref<WallLevel>(1, wallLevelRef);
    const destroyWallMaxDistance = ref<number>(20, maxDistanceValidator());
    const attackDelay = ref<number>(200, delayValidator());
    const resourceRatio = ref<number>(0.8, ratioValidator());
    const minutesUntilReload = ref<number>(10, minutesUntilReloadValidator());
    const maxDistance = ref<number>(20, maxDistanceValidator());
    const ignoreOlderThan = ref<number>(10, positiveIntegerRef);
    const plunderedResourcesRatio = ref<number>(1, ratioValidator());
    const pageDelay = ref<number>(2000, delayValidator());
    const villageDelay = ref<number>(2000, delayValidator());
    const maxDistanceC = ref<number>(20, maxDistanceValidator());

    const plunderGroupId = ref<number | null>(null, positiveIntegerOrNullRef);
    const fieldsPerWave = ref<number>(10, maxDistanceValidator(5));

    const blindAttackPattern = ref<BlindAttackPattern>('smaller', arrayIncludesRef(blindAttackPatterns));
    const useCPattern = ref<UseCPattern>('normal', arrayIncludesRef(useCPatterns));
    
    return mechanus.define('plunderConfig', {
        active,
        ignoreWall,
        destroyWall,
        groupAttack,
        useC,
        ignoreDelay,
        blindAttack,

        wallLevelToIgnore,
        wallLevelToDestroy,
        destroyWallMaxDistance,
        attackDelay,
        resourceRatio,
        minutesUntilReload,
        maxDistance,
        ignoreOlderThan,
        plunderedResourcesRatio,
        pageDelay,
        villageDelay,
        maxDistanceC,

        plunderGroupId,
        fieldsPerWave,

        blindAttackPattern,
        useCPattern
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