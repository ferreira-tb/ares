<script setup lang="ts">
import { computed, h, nextTick } from 'vue';
import { NButton, NButtonGroup, NEllipsis, NListItem, NThing } from 'naive-ui';
import { watchDeep } from '@vueuse/core';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { useGameDataStore, usePlunderConfigStore, usePlunderHistoryStore } from '$renderer/stores';
import { StandardWindowName } from '$common/enum';
import StorageIcon18 from '$icons/buildings/StorageIcon18.vue';
import LabelAmount from '$renderer/components/LabelAmount.vue';
import TagActiveStatus from '$renderer/components/TagActiveStatus.vue';

const gameData = useGameDataStore();

const config = usePlunderConfigStore();
const currentConfig = await ipcInvoke('plunder:get-config');
if (currentConfig) config.$patch(currentConfig);

const history = usePlunderHistoryStore();
const currentHistory = await ipcInvoke('plunder:get-history', true);
history.$patch(currentHistory);

await nextTick();
const resources = history.useTotal();

const buttonText = computed(() => {
    return config.active ? 'Parar' : 'Saquear';
});

const disabled = computed(() => {
    return gameData.features.farmAssistant === false;
});

watchDeep(config, () => {
    ipcSend('plunder:update-config', config.raw());
});
</script>

<template>
	<section>
        <NListItem>
            <NThing>
                <template #header>
                    <div class="panel-overview-thing-header">
                        <NEllipsis :tooltip="false">Saque</NEllipsis>
                        <TagActiveStatus :active="config.active" />
                    </div>
                </template>

                <LabelAmount :amount="resources" :icon="() => h(StorageIcon18)" />
            </NThing>
            <template #suffix>
                <NButtonGroup>
                    <NButton :disabled="disabled" @click="config.active = !config.active">
                        {{ buttonText }}
                    </NButton>
                    <NButton @click="ipcSend('window:open', StandardWindowName.PlunderTemplate)">
                        Modelos
                    </NButton>
                    <NButton @click="ipcSend('window:open', StandardWindowName.PlunderHistory)">
                        Histórico
                    </NButton>
                    <NButton @click="ipcSend('window:open', StandardWindowName.ConfigPlunder)">
                        Configurações
                    </NButton>
                </NButtonGroup>
            </template>
        </NListItem>
    </section>
</template>