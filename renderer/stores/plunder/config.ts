import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { WallLevel } from '$types/game';
import type { PlunderConfigType, BlindAttackPattern, UseCPattern } from '$types/plunder';
import type { PiniaPlunderConfigStoreType } from '$types/stores';

export const usePlunderConfigStore = defineStore('plunder-config', () => {
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
    };

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