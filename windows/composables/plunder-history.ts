import { computed, effectScope, reactive, ref, toRef, toValue, type MaybeRefOrGetter } from 'vue';
import { tryOnScopeDispose, watchDeep, watchImmediate } from '@vueuse/core';
import { Kronos } from '@tb-dev/kronos';
import { ipcInvoke } from '$renderer/ipc';
import { decodeString, getContinentFromCoords } from '$common/utils';

export function usePlunderHistory(
    history: MaybeRefOrGetter<PlunderHistoryType>,
    period: MaybeRefOrGetter<PlunderHistoryTimePeriod>
) {
    const scope = effectScope();

    const headerProps = ref<PlunderHistoryDataTableHeaderProps>({
        average: 0,
        wood: 0,
        stone: 0,
        iron: 0,
        attackAmount: 0,
        destroyedWalls: 0
    });

    const historyRef = toRef(history);
    const periodRef = toRef(period);

    const villageData = ref<PlunderHistoryVillageData[]>([]);
    const villageMap = reactive(new Map<number, WorldVillageType>());

    function onHeaderInfoUpdated(callback: (newProps: PlunderHistoryDataTableHeaderProps) => void) {
        const unwatch = watchDeep(headerProps, callback);
        tryOnScopeDispose(unwatch);
    };

    scope.run(() => {
        const idList = computed<number[]>(() => {
            return Object.keys(historyRef.value.villages).asIntegerListStrict();
        });
        
        watchImmediate(idList, async (updatedList) => {
            const list = updatedList.filter((id) => !villageMap.has(id));
            if (list.length === 0) return;
        
            const worldVillages = await ipcInvoke('world-data:get-village', list);
            for (const village of worldVillages) {
                villageMap.set(village.id, village);
            };
        });

        watchImmediate([periodRef, villageMap, () => historyRef.value.villages], () => {
            const allVillages: PlunderHistoryVillageData[] = [];

            let totalWood: number = 0;
            let totalStone: number = 0;
            let totalIron: number = 0;
            let totalAttackAmount: number = 0;
            let totalDestroyedWalls: number = 0;

            for (const [rawId, logs] of Object.entries(historyRef.value.villages)) {
                const id = rawId.toIntegerStrict();
                if (!villageMap.has(id) || logs.length === 0) continue;
        
                const info = villageMap.getStrict(id);
                const parsedLogs = parseLogs(logs, periodRef);
                if (parsedLogs.attackAmount === 0) continue;

                totalWood += parsedLogs.wood;
                totalStone += parsedLogs.stone;
                totalIron += parsedLogs.iron;
        
                const data = {
                    coords: `${info.x.toString(10)}|${info.y.toString(10)} ${getContinentFromCoords(info.x, info.y, 'K')}`,
                    name: decodeString(info.name),
                    score: 0,
                    total: parsedLogs.wood + parsedLogs.stone + parsedLogs.iron,
                    attackAmount: parsedLogs.attackAmount,
                    destroyedWalls: parsedLogs.destroyedWalls
                };
        
                allVillages.push(data);
            };
        
            if (allVillages.length === 0) return;
            const weightedSum = allVillages.reduce((acc, curr) => acc + (curr.total * curr.attackAmount), 0);
            for (const village of allVillages) {
                totalAttackAmount += village.attackAmount;
                totalDestroyedWalls += village.destroyedWalls;
            };

            if (totalAttackAmount === 0) return;
            const average = Math.ceil(weightedSum / totalAttackAmount);

            if (average === 0) return;
            for (const village of allVillages) {
                village.score = (village.total / average) * 100;
            };
        
            villageData.value = allVillages;
            headerProps.value.average = average;
            headerProps.value.wood = totalWood;
            headerProps.value.stone = totalStone;
            headerProps.value.iron = totalIron;
            headerProps.value.attackAmount = totalAttackAmount;
            headerProps.value.destroyedWalls = totalDestroyedWalls;
        });
    });

    tryOnScopeDispose(() => scope.stop());

    return {
        villageData,
        onHeaderInfoUpdated
    };
};

function parseLogs(logs: PlunderHistoryVillageType[], periodRef: MaybeRefOrGetter<PlunderHistoryTimePeriod>) {
    let wood: number = 0;
    let stone: number = 0;
    let iron: number = 0;
    let attackAmount: number = 0;
    let destroyedWalls: number = 0;

    const now = Date.now();
    logs = logs.filter((log) => log.attackAmount > 0);

    const period = toValue(periodRef);
    if (period === 'day') {
        const midnight = new Date().setUTCHours(0, 0, 0, 0);
        logs = logs.filter((log) => log.addedAt === midnight);
    } else if (period === 'week') {
        logs = logs.filter((log) => log.addedAt >= (now - Kronos.Week));
    } else {
        logs = logs.filter((log) => log.addedAt >= (now - Kronos.Month));
    };

    for (const log of logs) {
        wood += log.wood;
        stone += log.stone;
        iron += log.iron;
        attackAmount += log.attackAmount;
        destroyedWalls += log.destroyedWalls;
    };

    return {
        wood,
        stone,
        iron,
        attackAmount,
        destroyedWalls
    } as const;
};