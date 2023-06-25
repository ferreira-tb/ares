<script setup lang="ts">
import { computed, ref, type ComponentPublicInstance } from 'vue';
import { useElementSize, useWindowSize, watchImmediate } from '@vueuse/core';
import { Kronos } from '@tb-dev/kronos';
import { computedAsync, useIpcOn, useUserAlias } from '$renderer/composables';
import { ipcInvoke } from '$renderer/ipc';
import { decodeString, getContinentFromCoords } from '$common/utils';
import PlunderHistoryHeader from '$windows/components/PlunderHistoryHeader.vue';
import PlunderHistoryDataTable from '$windows/components/PlunderHistoryDataTable.vue';
import ResultGuest from '$renderer/components/ResultGuest.vue';

const userAlias = useUserAlias();

const headerRef = ref<ComponentPublicInstance | null>(null);
const { height } = useWindowSize();
const { height: headerHeight } = useElementSize(headerRef);
const tableMaxHeight = computed(() => (height.value - headerHeight.value) - 100);

const plunderHistory = await ipcInvoke('plunder:get-history', false);
const villageHistory = ref<PlunderHistoryType['villages']>({});
villageHistory.value = plunderHistory.villages;

useIpcOn('plunder:did-update-villages-history', (_e, villages) => {
    villageHistory.value = villages;
});

const period = ref<'day' | 'week' | 'month'>('month');
const headerProps = ref<PlunderHistoryDataTableHeaderProps>({
    average: 0,
    wood: 0,
    stone: 0,
    iron: 0,
    attackAmount: 0,
    destroyedWalls: 0
});

const villageData = ref<PlunderHistoryVillageData[]>([]);
const villageMap = computedAsync<Map<number, WorldVillageType>>(new Map(), async () => {
    const map = new Map<number, WorldVillageType>();
    if (!userAlias.value) return map;

    const keys = Object.keys(villageHistory.value).asIntegerListStrict();
    if (keys.length > 0) {
        const villages = await ipcInvoke('world-data:get-village', keys);
        for (const village of villages) {
            map.set(village.id, village);
        }
    }
    
    return map;
});

watchImmediate([period, villageMap, villageHistory], () => {
    const allVillages: PlunderHistoryVillageData[] = [];

    let average: number = 0;
    let totalWood: number = 0;
    let totalStone: number = 0;
    let totalIron: number = 0;
    let totalAttackAmount: number = 0;
    let totalDestroyedWalls: number = 0;

    for (const [key, value] of Object.entries(villageHistory.value)) {
        const id = key.toIntegerStrict();
        if (!villageMap.value.has(id) || value.length === 0) continue;

        const info = villageMap.value.getStrict(id);
        const logs = parseLogs(value);
        if (logs.attackAmount === 0) continue;

        totalWood += logs.wood;
        totalStone += logs.stone;
        totalIron += logs.iron;

        const { x, y } = info;
        const data = {
            coords: `${x.toString(10)}|${y.toString(10)} ${getContinentFromCoords(info.x, info.y, 'K')}`,
            name: decodeString(info.name),
            score: 0,
            total: logs.wood + logs.stone + logs.iron,
            attackAmount: logs.attackAmount,
            destroyedWalls: logs.destroyedWalls
        };

        allVillages.push(data);
    }

    if (allVillages.length > 0) {
        const weightedSum = allVillages.reduce((acc, curr) => acc + (curr.total * curr.attackAmount), 0);
        for (const village of allVillages) {
            totalAttackAmount += village.attackAmount;
            totalDestroyedWalls += village.destroyedWalls;
        }

        if (totalAttackAmount > 0) {
            average = Math.ceil(weightedSum / totalAttackAmount);
            for (const village of allVillages) {
                village.score = (village.total / average) * 100;
            }
        }
    }

    villageData.value = allVillages;
    headerProps.value.average = average;
    headerProps.value.wood = totalWood;
    headerProps.value.stone = totalStone;
    headerProps.value.iron = totalIron;
    headerProps.value.attackAmount = totalAttackAmount;
    headerProps.value.destroyedWalls = totalDestroyedWalls;
});

function parseLogs(logs: PlunderHistoryVillageType[]): PlunderAttackLog {
    let wood: number = 0;
    let stone: number = 0;
    let iron: number = 0;
    let attackAmount: number = 0;
    let destroyedWalls: number = 0;

    const now = Date.now();
    logs = logs.filter((log) => log.attackAmount > 0);

    if (period.value === 'day') {
        const midnight = new Date().setUTCHours(0, 0, 0, 0);
        logs = logs.filter((log) => log.addedAt === midnight);
    } else if (period.value === 'week') {
        logs = logs.filter((log) => log.addedAt >= (now - Kronos.Week));
    } else {
        logs = logs.filter((log) => log.addedAt >= (now - Kronos.Month));
    }

    for (const log of logs) {
        wood += log.wood;
        stone += log.stone;
        iron += log.iron;
        attackAmount += log.attackAmount;
        destroyedWalls += log.destroyedWalls;
    }

    return {
        wood,
        stone,
        iron,
        attackAmount,
        destroyedWalls
    };
}
</script>

<template>
    <main v-if="userAlias">
        <div ref="headerRef">
            <PlunderHistoryHeader v-model:period="period" v-bind="headerProps" />
        </div>

        <!-- A chave garante que a tabela será atualizada caso o alias mude. -->
        <Transition name="tb-fade" mode="out-in">
            <PlunderHistoryDataTable
                :key="userAlias"
                :village-data="villageData"
                :header-props="headerProps"
                :period="period"
                :max-height="tableMaxHeight"
            />
        </Transition>
    </main>

    <ResultGuest
        v-else
        description="É necessário estar logado para acessar o histórico de saque."
        to-center
    />
</template>