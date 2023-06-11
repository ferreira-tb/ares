import { ref } from 'mechanus';

export function definePlunderConfigStore(mechanus: Mechanus) {
    // Painel
    const active = ref<boolean>(false);
    const ignoreWall = ref<boolean>(false);
    const destroyWall = ref<boolean>(false);
    const groupAttack = ref<boolean>(false);
    const useC = ref<boolean>(false);
    const ignoreDelay = ref<boolean>(false);
    const blindAttack = ref<boolean>(false);

    // Ataque
    const maxDistance = ref<number>(20);
    const ignoreOlderThan = ref<number>(10);
    const attackDelay = ref<number>(200);
    const resourceRatio = ref<number>(0.8);
    const blindAttackPattern = ref<BlindAttackPattern>('smaller');

    // Modelo C
    const useCPattern = ref<UseCPattern>('normal');
    const maxDistanceC = ref<number>(10);
    const ignoreOlderThanC = ref<number>(5);
    const useCWhenResourceRatioIsBiggerThan = ref<number>(3);

    // Grupo
    const plunderGroupId = ref<number | null>(null);
    const fieldsPerWave = ref<number>(10);
    const villageDelay = ref<number>(2000);

    // Muralha
    const wallLevelToIgnore = ref<WallLevel>(1);
    const wallLevelToDestroy = ref<WallLevel>(1);
    const destroyWallMaxDistance = ref<number>(20);
    
    // Outros
    const minutesUntilReload = ref<number>(10);
    const plunderedResourcesRatio = ref<number>(1);
    const pageDelay = ref<number>(2000);
    
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