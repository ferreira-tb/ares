<script setup lang="ts">
import { h, computed, ref, reactive, watch } from 'vue';
import { NDataTable, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { useUserAlias } from '$renderer/composables';
import { assertUserAlias } from '$common/guards';
import { RendererProcessError } from '$renderer/error';
import ResultError from '$renderer/components/ResultError.vue';
import TableCellNumber from '$renderer/components/TableCellNumber.vue';
import SpearIcon18 from '$icons/units/SpearIcon18.vue';
import SwordIcon18 from '$icons/units/SwordIcon18.vue';
import AxeIcon18 from '$icons/units/AxeIcon18.vue';
import ArcherIcon18 from '$icons/units/ArcherIcon18.vue';
import SpyIcon18 from '$icons/units/SpyIcon18.vue';
import LightIcon18 from '$icons/units/LightIcon18.vue';
import MarcherIcon18 from '$icons/units/MarcherIcon18.vue';
import HeavyIcon18 from '$icons/units/HeavyIcon18.vue';
import RamIcon18 from '$icons/units/RamIcon18.vue';
import CatapultIcon18 from '$icons/units/CatapultIcon18.vue';
import type { PaginationProps, DataTableBaseColumn } from 'naive-ui';

interface DemolitionData extends DemolitionTroops {
    level: number;
}

const message = useMessage();

const userAlias = useUserAlias();
const isArcherWorld = await ipcInvoke('world:is-archer-world');
const template = await ipcInvoke('plunder:get-demolition-config');
const demolitionData = reactive<DemolitionData[]>([]);

if (template) {
    for (const [wallLevel, units] of Object.entries(template.units)) {
        const level = Number.parseIntStrict(wallLevel);
        if (level === 0) continue;
        demolitionData.push({ level, ...units });
    }
    
    demolitionData.sort((a, b) => a.level - b.level);
}

const columns: DataTableBaseColumn[] = [
    { title: 'Nível', key: 'level' },
    { title: () => h(SpearIcon18), key: 'spear' },
    { title: () => h(SwordIcon18), key: 'sword' },
    { title: () => h(AxeIcon18), key: 'axe' },
    { title: () => h(SpyIcon18), key: 'spy' },
    { title: () => h(LightIcon18), key: 'light' },
    { title: () => h(HeavyIcon18), key: 'heavy' },
    { title: () => h(RamIcon18), key: 'ram' },
    { title: () => h(CatapultIcon18), key: 'catapult' }
];

// Se o mundo possui arqueiros, adiciona as colunas de arqueiros e arqueiros a cavalo.
if (isArcherWorld) {
    columns.splice(4, 0, { title: () => h(ArcherIcon18), key: 'archer' });
    columns.splice(7, 0, { title: () => h(MarcherIcon18), key: 'marcher' });
}

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
                    throw new RendererProcessError('Could not find the correct row in the table.');
                } else if (!(column.key in dataItem)) {
                    throw new RendererProcessError('Could not find the correct column in the table.');
                } else if (typeof newValue !== typeof dataItem[column.key as T]) {
                    throw new RendererProcessError('Old and new values are not of the same type.');
                }

                dataItem[column.key as T] = newValue;
            }
        });
    }
}

const page = ref<number>(1);
const pagination = computed<PaginationProps>(() => ({
    pageSize: 10,
    page: page.value
}));

watch(demolitionData, async (newData) => {
    try {
        if (!template) throw new Error('There is no demolition troops template.');
        assertUserAlias(userAlias, RendererProcessError);
        for (const data of newData) {
            const { level, ...units } = data;
            const key = level.toString(10) as StringWallLevel;
            if (!(key in template.units)) {
                throw new RendererProcessError(`There is no wall level ${key} in the demolition troops template.`);
            }

            template.units[key] = units;
        }

        const saved = await ipcInvoke('plunder:save-demolition-config', template);
        if (saved) {
            message.success('Tudo certo!');
        } else {
            message.error('Ocorreu algum erro :(');
        }

    } catch (err) {
        RendererProcessError.catch(err);
    }
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