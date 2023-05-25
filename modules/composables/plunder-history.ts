import { computed, effectScope, reactive, ref, watch, type Ref } from 'vue';
import { tryOnScopeDispose, watchImmediate } from '@vueuse/core';
import { Kronos } from '@tb-dev/kronos';
import { ipcInvoke } from '$renderer/ipc';
import { getContinentFromCoords } from '$global/helpers';

export function usePlunderHistoryVillageData(history: Ref<PlunderHistoryType>, period: Ref<PlunderHistoryTimePeriod>) {
    const scope = effectScope();

    const weightedAverage = ref<number>(0);
    const villageData = ref<PlunderHistoryVillageData[]>([]);
    const villageMap = reactive(new Map<number, WorldVillagesType>());

    function onAverageChange(callback: (average: number, previousAverage: number) => void) {
        const unwatch = watch(weightedAverage, callback);
        tryOnScopeDispose(() => unwatch());
    };

    scope.run(() => {
        const idList = computed<number[]>(() => {
            return Object.keys(history.value.villages).asIntegerListStrict();
        });
        
        watchImmediate(idList, async (updatedList) => {
            const list = updatedList.filter((id) => !villageMap.has(id));
            if (list.length === 0) return;
        
            const worldVillages = await ipcInvoke('world-data:get-village', list);
            for (const village of worldVillages) {
                villageMap.set(village.id, village);
            };
        });

        watchImmediate([period, villageMap, () => history.value.villages], () => {
            const allVillages: PlunderHistoryVillageData[] = [];
            for (const [rawId, logs] of Object.entries(history.value.villages)) {
                const id = rawId.toIntegerStrict();
                if (!villageMap.has(id) || logs.length === 0) continue;
        
                const info = villageMap.getStrict(id);
                const parsedLogs = parseLogs(logs, period);
                if (parsedLogs.attackAmount === 0) continue;
        
                const data = {
                    coords: `${info.x.toString(10)}|${info.y.toString(10)} ${getContinentFromCoords(info.x, info.y, 'K')}`,
                    name: decodeURIComponent(info.name.replace(/\+/g, ' ')),
                    score: 0,
                    ...parsedLogs
                };
        
                allVillages.push(data);
            };
        
            if (allVillages.length === 0) return;
            const weightedSum = allVillages.reduce((acc, curr) => acc + (curr.total * curr.attackAmount), 0);
            const totalAttacks = allVillages.reduce((acc, curr) => acc + curr.attackAmount, 0);
            if (totalAttacks === 0) return;
        
            const average = Math.ceil(weightedSum / totalAttacks);
            if (average === 0) return;
        
            for (const village of allVillages) {
                village.score = (village.total / average) * 100;
            };
        
            villageData.value = allVillages;
            weightedAverage.value = average;
        });
    });

    tryOnScopeDispose(() => scope.stop());

    return {
        villageData,
        onAverageChange
    };
};

function parseLogs(logs: PlunderHistoryVillageType[], period: Ref<PlunderHistoryTimePeriod>) {
    let total: number = 0;
    let attackAmount: number = 0;
    let destroyedWalls: number = 0;

    const now = Date.now();
    const midnight = new Date().setUTCHours(0, 0, 0, 0);

    logs = logs.filter((log) => log.attackAmount > 0);
    if (period.value === 'day') {
        logs = logs.filter((log) => log.addedAt === midnight);
    } else if (period.value === 'week') {
        logs = logs.filter((log) => log.addedAt >= (now - Kronos.Week));
    } else {
        logs = logs.filter((log) => log.addedAt >= (now - Kronos.Month));
    };

    for (const log of logs) {
        total += (log.wood + log.stone + log.iron);
        attackAmount += log.attackAmount;
        destroyedWalls += log.destroyedWalls;
    };

    return {
        total,
        attackAmount,
        destroyedWalls
    } as const;
};