<script setup lang="ts">
import { computed, nextTick, toRef } from 'vue';
import { NDivider, NGrid, NGridItem, NInputNumber, NSelect } from 'naive-ui';
import { watchDeep } from '@vueuse/core';
import { computedAsync, useGroups } from '$renderer/composables';
import { useGameDataStore, useSnobConfigStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { decodeString } from '$common/utils';
import GroupsButtonUpdate from '$renderer/components/GroupsButtonUpdate.vue';

const props = defineProps<{
    userAlias: UserAlias | null;
}>();

const alias = toRef(() => props.userAlias);
const locale = await ipcInvoke('app:locale');

const gameData = useGameDataStore();

const config = useSnobConfigStore();
const currentConfig = await ipcInvoke('snob:get-config');
if (currentConfig) config.$patch(currentConfig);
await nextTick();

const villages = computedAsync<WorldVillageType[]>([], async () => {
    if (!alias.value || typeof gameData.player.id !== 'number') return [];
    const playerVillages = await ipcInvoke('world-data:get-player-villages', gameData.player.id);
    return playerVillages;
});

const villageOptions = computed(() => {
    const options = villages.value.map(({ id: villageId, name: villageName }) => {
        return { label: decodeString(villageName), value: villageId };
    });

    options.sort((a, b) => a.label.localeCompare(b.label, locale));
    return options;
});

const { groups: allGroups } = useGroups(alias);
const groupOptions = computed(() => {
    const options = allGroups.value.map(({ id: groupId, name: groupName }) => {
        return { label: groupName, value: groupId };
    });

    options.push({ label: 'Todos', value: 0 });
    options.sort((a, b) => a.label.localeCompare(b.label, locale));
    return options;
});

const modeOptions = [
    { label: 'Simples', value: 'single' },
    { label: 'Grupo', value: 'group' }
] satisfies NSelectOptions<SnobConfigType['mode']>;

const timeUnitOptions = [
    { label: 'Segundos', value: 'seconds' },
    { label: 'Minutos', value: 'minutes' },
    { label: 'Horas', value: 'hours' }
] satisfies NSelectOptions<SnobConfigType['timeUnit']>;

watchDeep(config, () => {
    ipcSend('snob:update-config', config.raw());
});
</script>

<template>
    <div id="panel-buildings-snob">
        <NDivider title-placement="left" class="config-divider">Cunhagem</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-label">Modo de cunhagem</div>
            </NGridItem>
            <NGridItem>
                <div class="config-select">
                    <NSelect v-model:value="config.mode" :options="modeOptions" />
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Intervalo</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.delay"
                    class="config-input"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => Number.isInteger(v) && v >= 1 && v <= 9999"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Unidade de tempo</div>
            </NGridItem>
            <NGridItem>
                <div class="config-select">
                    <NSelect v-model:value="config.timeUnit" :options="timeUnitOptions" />
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Aldeia</div>
            </NGridItem>
            <NGridItem>
                <div class="config-select">
                    <NSelect
                        v-model:value="config.village"
                        :disabled="config.mode !== 'single'"
                        :options="villageOptions"
                        placeholder="Selecione uma aldeia"
                    />
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Grupo</div>
            </NGridItem>
            <NGridItem>
                <div class="config-select">
                    <NSelect
                        v-model:value="config.group"
                        :disabled="config.mode !== 'group'"
                        :options="groupOptions"
                        placeholder="Selecione um grupo"
                    />
                </div>
            </NGridItem>

            <NGridItem :span="2">
                <GroupsButtonUpdate />
            </NGridItem>
        </NGrid>
    </div>
</template>

<style scoped lang="scss">
#panel-buildings-snob {
    padding: 0.5em;
}
</style>