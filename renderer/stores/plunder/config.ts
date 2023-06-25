import { ref } from 'vue';
import { defineStore } from 'pinia';
import { DefaultPlunderConfig } from '$common/templates';

export const usePlunderConfigStore = defineStore('plunder-config', () => {
    const config = new DefaultPlunderConfig();

    const active = ref<boolean>(config.active);
    const mode = ref<'single' | 'group'>(config.mode);
    const village = ref<number | null>(config.village);
    const group = ref<number>(config.group);

    // Ataque
    const maxDistance = ref<number>(config.maxDistance);
    const ignoreOlderThan = ref<number>(config.ignoreOlderThan);
    const ratio = ref<number>(config.ratio);
    const attackDelay = ref<number>(config.attackDelay);
    const blindAttack = ref<PlunderConfigType['blindAttack']>(config.blindAttack);

    // Grupo
    const fieldsPerWave = ref<number>(config.fieldsPerWave);
    const villageDelay = ref<number>(config.villageDelay);

    // Muralha
    const ignoreWall = ref<boolean>(config.ignoreWall);
    const wallLevelToIgnore = ref<number>(config.wallLevelToIgnore);
    const destroyWall = ref<boolean>(config.destroyWall);
    const wallLevelToDestroy = ref<number>(config.wallLevelToDestroy);
    const destroyWallMaxDistance = ref<number>(config.destroyWallMaxDistance);
    const demolitionTemplate = ref<number>(config.demolitionTemplate);

    // Modelo C
    const useC = ref<PlunderConfigType['useC']>(config.useC);
    const maxDistanceC = ref<number>(config.maxDistanceC);
    const ignoreOlderThanC = ref<number>(config.ignoreOlderThanC);
    const useCWhenRatioIsBiggerThan = ref<number>(config.useCWhenRatioIsBiggerThan);
    
    // Outros
    const minutesUntilReload = ref<number>(config.minutesUntilReload);
    const estimate = ref<number>(config.estimate);
    const pageDelay = ref<number>(config.pageDelay);
    
    function raw(): PlunderConfigType {
        return {
            active: active.value,
            mode: mode.value,
            village: village.value,
            group: group.value,
            
            maxDistance: maxDistance.value,
            ignoreOlderThan: ignoreOlderThan.value,
            ratio: ratio.value,
            attackDelay: attackDelay.value,
            blindAttack: blindAttack.value,

            fieldsPerWave: fieldsPerWave.value,
            villageDelay: villageDelay.value,

            ignoreWall: ignoreWall.value,
            wallLevelToIgnore: wallLevelToIgnore.value,
            destroyWall: destroyWall.value,
            wallLevelToDestroy: wallLevelToDestroy.value,
            destroyWallMaxDistance: destroyWallMaxDistance.value,
            demolitionTemplate: demolitionTemplate.value,

            useC: useC.value,
            maxDistanceC: maxDistanceC.value,
            ignoreOlderThanC: ignoreOlderThanC.value,
            useCWhenRatioIsBiggerThan: useCWhenRatioIsBiggerThan.value,

            minutesUntilReload: minutesUntilReload.value,
            estimate: estimate.value,
            pageDelay: pageDelay.value
        };
    }

    return {
        active,
        mode,
        village,
        group,

        maxDistance,
        ignoreOlderThan,
        ratio,
        attackDelay,
        blindAttack,

        fieldsPerWave,
        villageDelay,

        ignoreWall,
        wallLevelToIgnore,
        destroyWall,
        wallLevelToDestroy,
        destroyWallMaxDistance,
        demolitionTemplate,

        useC,
        maxDistanceC,
        ignoreOlderThanC,
        useCWhenRatioIsBiggerThan,

        minutesUntilReload,
        estimate,
        pageDelay,
        
        // Funções
        raw
    } satisfies PiniaPlunderConfigStoreType;
});