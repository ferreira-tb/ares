import { ref } from 'mechanus';
import { DefaultPlunderConfig } from '$common/templates';

export function definePlunderConfigStore(mechanus: Mechanus) {
    const config = new DefaultPlunderConfig();

    // Painel
    const active = ref<boolean>(config.active);
    const ignoreWall = ref<boolean>(config.ignoreWall);
    const destroyWall = ref<boolean>(config.destroyWall);
    const groupAttack = ref<boolean>(config.groupAttack);
    const useC = ref<boolean>(config.useC);
    const ignoreDelay = ref<boolean>(config.ignoreDelay);
    const blindAttack = ref<boolean>(config.blindAttack);

    // Ataque
    const maxDistance = ref<number>(config.maxDistance);
    const ignoreOlderThan = ref<number>(config.ignoreOlderThan);
    const attackDelay = ref<number>(config.attackDelay);
    const resourceRatio = ref<number>(config.resourceRatio);
    const blindAttackPattern = ref<BlindAttackPattern>(config.blindAttackPattern);

    // Modelo C
    const useCPattern = ref<UseCPattern>(config.useCPattern);
    const maxDistanceC = ref<number>(config.maxDistanceC);
    const ignoreOlderThanC = ref<number>(config.ignoreOlderThanC);
    const useCWhenResourceRatioIsBiggerThan = ref<number>(config.useCWhenResourceRatioIsBiggerThan);

    // Grupo
    const plunderGroupId = ref<number | null>(config.plunderGroupId);
    const fieldsPerWave = ref<number>(config.fieldsPerWave);
    const villageDelay = ref<number>(config.villageDelay);

    // Muralha
    const wallLevelToIgnore = ref<WallLevel>(config.wallLevelToIgnore);
    const wallLevelToDestroy = ref<WallLevel>(config.wallLevelToDestroy);
    const destroyWallMaxDistance = ref<number>(config.destroyWallMaxDistance);
    
    // Outros
    const minutesUntilReload = ref<number>(config.minutesUntilReload);
    const plunderedResourcesRatio = ref<number>(config.plunderedResourcesRatio);
    const pageDelay = ref<number>(config.pageDelay);
    
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