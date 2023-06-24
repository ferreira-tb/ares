import { ref } from 'vue';
import { defineStore } from 'pinia';
import { DefaultPlunderConfig } from '$common/templates';

export const usePlunderConfigStore = defineStore('plunder-config', () => {
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
    
    function raw(): PlunderConfigType {
        return {
            active: active.value,
            ignoreWall: ignoreWall.value,
            destroyWall: destroyWall.value,
            groupAttack: groupAttack.value,
            useC: useC.value,
            ignoreDelay: ignoreDelay.value,
            blindAttack: blindAttack.value,

            maxDistance: maxDistance.value,
            ignoreOlderThan: ignoreOlderThan.value,
            attackDelay: attackDelay.value,
            resourceRatio: resourceRatio.value,
            blindAttackPattern: blindAttackPattern.value,

            useCPattern: useCPattern.value,
            maxDistanceC: maxDistanceC.value,
            ignoreOlderThanC: ignoreOlderThanC.value,
            useCWhenResourceRatioIsBiggerThan: useCWhenResourceRatioIsBiggerThan.value,

            plunderGroupId: plunderGroupId.value,
            fieldsPerWave: fieldsPerWave.value,
            villageDelay: villageDelay.value,

            wallLevelToIgnore: wallLevelToIgnore.value,
            wallLevelToDestroy: wallLevelToDestroy.value,
            destroyWallMaxDistance: destroyWallMaxDistance.value,
            
            minutesUntilReload: minutesUntilReload.value,
            plunderedResourcesRatio: plunderedResourcesRatio.value,
            pageDelay: pageDelay.value  
        };
    }

    return {
        // Painel
        active,
        ignoreWall,
        destroyWall,
        groupAttack,
        useC,
        ignoreDelay,
        blindAttack,

        // Ataque
        maxDistance,
        ignoreOlderThan,
        attackDelay,
        resourceRatio,
        blindAttackPattern,

        // Modelo C
        useCPattern,
        maxDistanceC,
        ignoreOlderThanC,
        useCWhenResourceRatioIsBiggerThan,

        // Grupo
        plunderGroupId,
        fieldsPerWave,
        villageDelay,

        // Muralha
        wallLevelToIgnore,
        wallLevelToDestroy,
        destroyWallMaxDistance,
        
        // Outros
        minutesUntilReload,
        plunderedResourcesRatio,
        pageDelay,
        
        // Funções
        raw
    } satisfies PiniaPlunderConfigStoreType;
});