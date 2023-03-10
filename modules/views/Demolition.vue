<script setup lang="ts">
import { h, computed, ref, reactive, watch } from 'vue';
import { NDataTable, useMessage } from 'naive-ui';
import { isObject, assertObject, assertKeyOf, toIntegerStrict, isInteger, assertSameType } from '@tb-dev/ts-guard';
import { ipcInvoke } from '$global/ipc.js';
import { assertUserAlias } from '$global/utils/guards.js';
import { ModuleConfigError } from '$modules/error.js';
import ErrorResult from '$vue/components/result/ErrorResult.vue';
import NumberCell from '$vue/components/table/NumberCell.vue';
import SpearIcon from '$icons/units/SpearIcon.vue';
import SwordIcon from '$icons/units/SwordIcon.vue';
import AxeIcon from '$icons/units/AxeIcon.vue';
import ArcherIcon from '$icons/units/ArcherIcon.vue';
import SpyIcon from '$icons/units/SpyIcon.vue';
import LightIcon from '$icons/units/LightIcon.vue';
import MarcherIcon from '$icons/units/MarcherIcon.vue';
import HeavyIcon from '$icons/units/HeavyIcon.vue';
import RamIcon from '$icons/units/RamIcon.vue';
import CatapultIcon from '$icons/units/CatapultIcon.vue';
import type { PaginationProps, DataTableBaseColumn } from 'naive-ui';
import type { DemolitionTroops } from '$types/game.js';

const message = useMessage();

interface DemolitionData extends DemolitionTroops {
    level: number;
};

const isArcherWorld = await ipcInvoke('is-archer-world');
const userAlias = await ipcInvoke('user-alias');
const template = await ipcInvoke('get-demolition-troops-config');
const demolitionData = reactive<DemolitionData[]>([]);

if (isObject(template)) {
    for (const [wallLevel, units] of Object.entries(template.units)) {
        const level = Number.parseIntStrict(wallLevel);
        if (level === 0) continue;
        demolitionData.push({ level, ...units });
    };
    
    demolitionData.sort((a, b) => a.level - b.level);
};

const columns: DataTableBaseColumn[] = [
    { title: 'Nível', key: 'level' },
    { title: () => h(SpearIcon), key: 'spear' },
    { title: () => h(SwordIcon), key: 'sword' },
    { title: () => h(AxeIcon), key: 'axe' },
    { title: () => h(SpyIcon), key: 'spy' },
    { title: () => h(LightIcon), key: 'light'},
    { title: () => h(HeavyIcon), key: 'heavy' },
    { title: () => h(RamIcon), key: 'ram' },
    { title: () => h(CatapultIcon), key: 'catapult' }
];

// Se o mundo possui arqueiros, adiciona as colunas de arqueiros e arqueiros a cavalo.
if (isArcherWorld === true) {
    columns.splice(4, 0, { title: () => h(ArcherIcon), key: 'archer' });
    columns.splice(7, 0, { title: () => h(MarcherIcon), key: 'marcher' });
};

for (const column of columns) {
    column.align = 'center';
    column.filter = false;
    column.sorter = false;
    column.resizable = false;
    
    if (column.key !== 'level') {
        column.render = (row) => h(NumberCell, {
            value: toIntegerStrict(row[column.key], isInteger, 10) as number,
            onCellUpdated(newValue: number) {
                const dataItem = demolitionData.find((data) => data.level === row.level);
                assertObject(dataItem, 'Não foi possível encontrar a linha correta na tabela.');
                assertKeyOf(column.key, dataItem, 'Não foi possível encontrar a coluna correta na tabela.');
                assertSameType(newValue, dataItem[column.key], 'O novo valor não é do mesmo tipo do valor antigo.');
                Reflect.set(dataItem, column.key, newValue);
            }
        });
    };
};

const page = ref<number>(1);
const pagination = computed<PaginationProps>(() => ({
    pageSize: 10,
    page: page.value
}));

watch(demolitionData, async (newData) => {
    try {
        assertObject(template);
        assertUserAlias(userAlias, ModuleConfigError);
        for (const data of newData) {
            const { level, ...units } = data;
            const key = level.toString(10);
            assertKeyOf(key, template.units);
            template.units[key] = units;
        };

        const status = await ipcInvoke('save-demolition-troops-config', template);
        if (status !== true) throw status;
        message.success('Tudo certo!');

    } catch (err) {
        message.error('Ocorreu algum erro :(');
        ModuleConfigError.catch(err);
    };
});
</script>

<template>
    <main v-if="template && userAlias">
        <NDataTable
            table-layout="fixed"
            :row-key="(row: DemolitionData) => row.level"
            :data="demolitionData"
            :columns="columns"
            :pagination="pagination"
            :on-update:page="(currentPage) => page = currentPage"
        />
    </main>

    <ErrorResult v-else />
</template>

<style scoped>
main {
    user-select: none;
}
</style>