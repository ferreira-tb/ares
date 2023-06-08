<script setup lang="ts">
import { computed, toRef } from 'vue';
import { NButton, NGrid, NGridItem, NRadio, NRadioGroup } from 'naive-ui';
import { watchDeep } from '@vueuse/core';
import { useSnobConfigStore } from '$renderer/stores/game/snob';
import { ipcSend } from '$renderer/ipc';

const config = useSnobConfigStore();
const snobButtonText = computed(() => config.active ? 'Parar' : 'Cunhar');

watchDeep(toRef(config), () => {
    ipcSend('snob:update-config', config.raw());
});
</script>

<template>
    <main>
        <div class="button-area">
            <NButton round @click="config.active = !config.active">
                {{ snobButtonText }}
            </NButton>
        </div>

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
.button-area {
    margin-bottom: 1.5rem;
}
</style>