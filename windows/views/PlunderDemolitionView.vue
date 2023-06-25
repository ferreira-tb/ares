<script setup lang="ts">
import { h, computed, nextTick, ref, toValue } from 'vue';
import { storeToRefs } from 'pinia';
import { useWindowSize } from '@vueuse/core';
import { NDataTable, NSelect/* , useMessage */ } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { computedAsync, useArcherWorld, useElementSize, useUserAlias } from '$renderer/composables';
import { usePlunderConfigStore } from '$renderer/stores';
import { RendererProcessError } from '$renderer/error';
import PlunderDemolitionTableCell from '$windows/components/PlunderDemolitionTableCell.vue';
import ResultGuest from '$renderer/components/ResultGuest.vue';
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

// const message = useMessage();
const userAlias = useUserAlias();
const isArcherWorld = useArcherWorld();
const locale = await ipcInvoke('app:locale');

const plunderConfigStore = usePlunderConfigStore();
const { demolitionTemplate } = storeToRefs(plunderConfigStore);
const currentConfig = await ipcInvoke('plunder:get-config');
if (currentConfig) {
    plunderConfigStore.$patch(currentConfig);
    await nextTick();
}

const header = ref<HTMLDivElement | null>(null);
const { height: headerHeight } = useElementSize(header);
const { height: windowHeight } = useWindowSize();
const tableHeight = computed(() => windowHeight.value - headerHeight.value - 20);

const templates = computedAsync(null, async () => {
    const alias = toValue(userAlias);
    if (!alias) return null;

    const demolitionTemplates = await ipcInvoke('plunder:get-demolition-templates-by-alias', alias);
    if (demolitionTemplates && demolitionTemplates.length > 0) return demolitionTemplates;

    const defaultTemplate = await ipcInvoke('plunder:default-demolition-template');
    return [defaultTemplate];
});

const selectOptions = computed(() => {
    if (!templates.value) return [];

    const mapped = templates.value.filter((t) => t.id > 0).map((template) => ({
        label: template.name,
        value: template.id
    }));

    mapped.sort((a, b) => a.label.localeCompare(b.label, locale));
    mapped.unshift({ label: 'Padrão', value: -1 });
    return mapped;
});

const selectedTemplate = computedAsync(null, async () => {
    if (!demolitionTemplate.value || !templates.value) return null;

    const alias = toValue(userAlias);
    if (demolitionTemplate.value === -1) {
        const defaultTemplate = await ipcInvoke('plunder:default-demolition-template', alias);
        return defaultTemplate;
    }

    const template = templates.value.find(({ id }) => id === demolitionTemplate.value);
    if (!template || (template.alias !== alias)) return null;
    return template;
});

const data = computed<PlunderDemolitionTemplateTableRow[]>(() => {
    if (!templates.value || templates.value.length === 0) return [];
    const template = selectedTemplate.value ?? templates.value[0];

    return Object.entries(template.units).map(([level, units]) => {
        return {
            level: Number.parseIntStrict(level),
            ...units
        };
    });
});

const columns = computed(() => {
    const tableCols: DataTableBaseColumn[] = [
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
    if (isArcherWorld.value) {
        tableCols.splice(4, 0, { title: () => h(ArcherIcon18), key: 'archer' });
        tableCols.splice(7, 0, { title: () => h(MarcherIcon18), key: 'marcher' });
    }

    for (const column of tableCols) {
        column.align = 'center';
        column.filter = false;
        column.sorter = false;
        column.resizable = false;
        
        if (column.key !== 'level') {
            const tableData = toValue(data);
            column.render = (row) => h(PlunderDemolitionTableCell, {
                value: Number.parseIntStrict(row[column.key] as string),
                onUpdate<T extends keyof PlunderDemolitionTemplateTableRow>(newValue: number) {
                    const dataItem = tableData.find(({ level }) => level === row.level);
                    if (!dataItem) {
                        throw new RendererProcessError('Row not found in the table.');
                    } else if (!(column.key in dataItem)) {
                        throw new RendererProcessError('Column not found in the row.');
                    } else if (typeof newValue !== typeof dataItem[column.key as T]) {
                        throw new RendererProcessError('Value type mismatch.');
                    }

                    dataItem[column.key as T] = newValue;
                }
            });
        }
    }

    return tableCols;
});

const page = ref<number>(1);
const pagination = computed<PaginationProps>(() => {
    return {
        pageSize: 10,
        page: page.value
    };
});
</script>

<template>
    <main v-if="userAlias" id="plunder-demolition">
        <div id="plunder-demolition-header" ref="header">
            <NSelect
                v-model:value="demolitionTemplate"
                placeholder="Selecione um modelo"
                :options="selectOptions"
            />
        </div>

        <NDataTable
            table-layout="fixed"
            :row-key="(row: PlunderDemolitionTemplateTableRow) => row.level"
            :data="data"
            :columns="columns"
            :pagination="pagination"
            :max-height="tableHeight"
            :on-update:page="(currentPage) => page = currentPage"
        />
    </main>

    <ResultGuest
        v-else
        description="É preciso estar logado para editar os modelos de demolição."
        to-center
    />
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

#plunder-demolition {
    user-select: none;
}

#plunder-demolition-header {
    @include main.flex-x-start-y-center($gap: 1em);
}
</style>