<script setup lang="ts">
import { h } from 'vue';
import { NButton } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { watchImmediate } from '@vueuse/core';
import { usePlunderConfigStore, usePlunderHistoryStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import StorageIcon from '$icons/buildings/StorageIcon.vue';

const locale = await ipcInvoke('app:locale');
const config = usePlunderConfigStore();
const { active } = storeToRefs(config);

const history = usePlunderHistoryStore();
const total = history.useTotal();

watchImmediate(active, async () => {
    const lastPlundered = await ipcInvoke('plunder:get-history');
    history.$patch(lastPlundered);
});
</script>

<template>
    <NButton
        quaternary
        :keyboard="false"
        :render-icon="() => h(StorageIcon)"
        @click="ipcSend('plunder:show-history')"
    >
        <span>{{ total.toLocaleString(locale) }}</span>
    </NButton>
</template>