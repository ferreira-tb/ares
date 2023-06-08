<script setup lang="ts">
import { computed, toRef } from 'vue';
import { NButton, NButtonGroup, NGrid, NGridItem, NRadio, NRadioGroup } from 'naive-ui';
import { computedAsync, watchDeep } from '@vueuse/core';
import { useSnobConfigStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import TheCoinedAmount from '$panel/components/TheCoinedAmount.vue';

const config = useSnobConfigStore();
const snobButtonText = computed(() => config.active ? 'Parar' : 'Cunhar');

const village = computedAsync(async () => {
    if (!config.village) return null;
    const data = await ipcInvoke('world-data:get-village', config.village);
    if (data.length === 0) return null;
    return data[0];
}, null);

watchDeep(toRef(config), () => {
    ipcSend('snob:update-config', config.raw());
});

console.log(village.value);
</script>

<template>
    <main>
        <div class="button-area">
            <NButtonGroup>
                <NButton round @click="config.active = !config.active">
                    {{ snobButtonText }}
                </NButton>
                <NButton disabled round @click="ipcSend('config:open', 'config-buildings-snob')">
                    Configurações
                </NButton>
            </NButtonGroup>
        </div>

        <TheCoinedAmount />

        <NGrid class="config-area" :cols="2" :x-gap="12" :y-gap="8">
            <NGridItem :span="2">
                <NRadioGroup v-model:value="config.mode" name="snob-mode">
                    <NRadio value="single" label="Simples" />
                    <NRadio value="group" label="Grupo" disabled />
                </NRadioGroup>
            </NGridItem>
        </NGrid>
    </main>
</template>

<style scoped lang="scss">
@use '$panel/assets/main.scss';

.button-area {
    @include main.flex-x-center-y-center;
    margin-bottom: 1em;
}
</style>