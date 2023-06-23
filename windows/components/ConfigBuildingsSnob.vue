<script setup lang="ts">
import { computed, nextTick } from 'vue';
import { NDivider, NGrid, NGridItem, NInputNumber, NResult, NSelect } from 'naive-ui';
import { computedAsync, watchDeep } from '@vueuse/core';
import { useGroups, useUserAlias } from '$renderer/composables';
import { useGameDataStore, useSnobConfigStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { decodeString } from '$common/utils';
import GroupsButtonUpdate from '$renderer/components/GroupsButtonUpdate.vue';

const userAlias = useUserAlias();
const locale = await ipcInvoke('app:locale');

const gameData = useGameDataStore();

const config = useSnobConfigStore();
const currentConfig = await ipcInvoke('snob:get-config');
if (currentConfig) config.$patch(currentConfig);
await nextTick();

const villages = computedAsync<WorldVillageType[]>(async () => {
    if (!userAlias.value || typeof gameData.player.id !== 'number') return [];
    const playerVillages = await ipcInvoke('world-data:get-player-villages', gameData.player.id);
    return playerVillages;
}, []);

const villageOptions = computed(() => {
    const options = villages.value.map(({ id: villageId, name: villageName }) => {
        return { label: decodeString(villageName), value: villageId };
    });

    options.sort((a, b) => a.label.localeCompare(b.label, locale));
    return options;
});

const { groups: allGroups } = useGroups(userAlias);
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
    <div v-if="userAlias" class="config-buildings-snob">
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
                <GroupsButtonUpdate />
            </NGridItem>
        </NGrid>
    </div>

    <div v-else class="result-info">
        <NResult
            status="info"
            title="Você está logado?"
            description="É necessário estar logado para acessar as configurações da academia."
        />
    </div>
</template>

<style scoped lang="scss">
.config-buildings-snob {
    padding: 0.5em;
}
</style>