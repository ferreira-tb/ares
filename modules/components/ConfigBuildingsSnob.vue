<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { NDivider, NGrid, NGridItem, NInputNumber, NSelect } from 'naive-ui';
import { watchDeep } from '@vueuse/core';
import { useGroupsStore, usePlayerStore, useSnobConfigStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { decodeString } from '$common/helpers';
import { ModuleConfigError } from '$modules/error';
import ButtonGroupsUpdate from '$renderer/components/ButtonGroupsUpdate.vue';

const locale = await ipcInvoke('app:locale');

const config = useSnobConfigStore();
const previousConfig = await ipcInvoke('snob:get-config');
if (previousConfig) config.$patch(previousConfig);

const groupsStore = useGroupsStore();
const allGroups = await ipcInvoke('game:get-all-village-groups');
if (allGroups.size > 0) groupsStore.$patch({ all: allGroups });

const playerStore = usePlayerStore();
const playerDataFromMainProcess = await ipcInvoke('player:get-store');
playerStore.$patch(playerDataFromMainProcess);

await nextTick();
if (!playerStore.id) throw new ModuleConfigError('Missing player id.');
const villages = ref(await ipcInvoke('world-data:get-player-villages', playerStore.id));

const villageOptions = computed(() => {
    const options = villages.value.map(({ id: villageId, name: villageName }) => {
        return { label: decodeString(villageName), value: villageId };
    });

    options.sort((a, b) => a.label.localeCompare(b.label, locale));
    return options;
});

const groupOptions = computed(() => {
    const options = Array.from(groupsStore.all).map(({ id: groupId, name: groupName }) => {
        return { label: decodeString(groupName), value: groupId };
    });

    options.push({ label: 'Todos', value: 0 });
    options.sort((a, b) => a.label.localeCompare(b.label, locale));
    return options;
});

const modeOptions = [
    { label: 'Simples', value: 'single' },
    { label: 'Grupo', value: 'group' }
] satisfies NSelectPatternOption<SnobConfigType['mode']>;

const timeUnitOptions = [
    { label: 'Segundos', value: 'seconds' },
    { label: 'Minutos', value: 'minutes' },
    { label: 'Horas', value: 'hours' }
] satisfies NSelectPatternOption<SnobConfigType['timeUnit']>;

watchDeep(config, () => {
    ipcSend('snob:update-config', config.raw());
});
</script>

<template>
    <div>
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
                    />
                </div>
            </NGridItem>

            <NGridItem :span="2">
                <ButtonGroupsUpdate v-model:groups="groupsStore.all" />
            </NGridItem>
        </NGrid>
    </div>
</template>