<script setup lang="ts">
import { h, computed, ref, reactive, watch } from 'vue';
import { NDataTable, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { assertUserAlias } from '$shared/guards';
import { ModuleConfigError } from '$modules/error';
import ResultError from '$renderer/components/ResultError.vue';
import TableCellNumber from '$renderer/components/TableCellNumber.vue';
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

interface DemolitionData extends DemolitionTroops {
    level: number;
};

const message = useMessage();

const isArcherWorld = await ipcInvoke('game:is-archer-world');
const userAlias = await ipcInvoke('user-alias');
const template = await ipcInvoke('plunder:get-demolition-config');
const demolitionData = reactive<DemolitionData[]>([]);

if (template) {
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
    { title: () => h(LightIcon), key: 'light' },
    { title: () => h(HeavyIcon), key: 'heavy' },
    { title: () => h(RamIcon), key: 'ram' },
    { title: () => h(CatapultIcon), key: 'catapult' }
];

// Se o mundo possui arqueiros, adiciona as colunas de arqueiros e arqueiros a cavalo.
if (isArcherWorld) {
    columns.splice(4, 0, { title: () => h(ArcherIcon), key: 'archer' });
    columns.splice(7, 0, { title: () => h(MarcherIcon), key: 'marcher' });
};

for (const column of columns) {
    column.align = 'center';
    column.filter = false;
    column.sorter = false;
    column.resizable = false;
    
    if (column.key !== 'level') {
        column.render = (row) => h(TableCellNumber, {
            value: Number.parseIntStrict(row[column.key] as string),
            onCellUpdated<T extends keyof DemolitionData>(newValue: number) {
                const dataItem = demolitionData.find((data) => data.level === row.level);
                if (!dataItem) {
                    throw new ModuleConfigError('Could not find the correct row in the table.');
                } else if (!(column.key in dataItem)) {
                    throw new ModuleConfigError('Could not find the correct column in the table.');
                } else if (typeof newValue !== typeof dataItem[column.key as T]) {
                    throw new ModuleConfigError('Old and new values are not of the same type.');
                };

                dataItem[column.key as T] = newValue;
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
        if (!template) throw new Error('There is no demolition troops template.');
        assertUserAlias(userAlias, ModuleConfigError);
        for (const data of newData) {
            const { level, ...units } = data;
            const key = level.toString(10) as StringWallLevel;
            if (!(key in template.units)) {
                throw new ModuleConfigError(`There is no wall level ${key} in the demolition troops template.`);
            };

            template.units[key] = units;
        };

        const saved = await ipcInvoke('plunder:save-demolition-config', template);
        if (saved) {
            message.success('Tudo certo!');
        } else {
            message.error('Ocorreu algum erro :(');
        };

    } catch (err) {
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

    <ResultError v-else />
</template>

<style scoped lang="scss">
main {
    user-select: none;
}
</style>