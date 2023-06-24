<script setup lang="ts">
import { computed, h, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { watchDeep } from '@vueuse/core';
import { NButton, NButtonGroup, NEllipsis, NListItem, NThing } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { useSnobConfigStore, useSnobHistoryStore } from '$renderer/stores';
import { StandardWindowName } from '$common/enum';
import CoinIcon18 from '$icons/misc/CoinIcon18.vue';
import LabelAmount from '$renderer/components/LabelAmount.vue';
import TagActiveStatus from '$renderer/components/TagActiveStatus.vue';

const config = useSnobConfigStore();
const currentConfig = await ipcInvoke('snob:get-config');
if (currentConfig) config.$patch(currentConfig);

const history = useSnobHistoryStore();
const currentHistory = await ipcInvoke('snob:get-history');
if (currentHistory) history.$patch(currentHistory);

await nextTick();
const { coins } = storeToRefs(history);

const buttonText = computed(() => {
    return config.active ? 'Parar' : 'Cunhar';
});

watchDeep(config, () => {
    ipcSend('snob:update-config', config.raw());
});
</script>

<template>
	<section>
        <NListItem>
            <NThing>
                <template #header>
                    <div class="panel-overview-thing-header">
                        <NEllipsis :tooltip="false">Cunhagem</NEllipsis>
                        <TagActiveStatus :active="config.active" />
                    </div>
                </template>

                <LabelAmount :amount="coins" :icon="() => h(CoinIcon18)" />
            </NThing>

            <template #suffix>
                <NButtonGroup>
                    <NButton @click="config.active = !config.active">
                        {{ buttonText }}
                    </NButton>
                    <NButton disabled>
                        Histórico
                    </NButton>
                    <NButton @click="$router.push({ name: StandardWindowName.PanelBotBuildingsSnob })">
                        Configurações
                    </NButton>
                </NButtonGroup>
            </template>
        </NListItem>
    </section>
</template>