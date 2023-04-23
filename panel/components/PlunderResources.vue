<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watchImmediate } from '@vueuse/core';
import { usePlunderConfigStore, usePlunderHistoryStore } from '$renderer/stores/plunder';
import { ipcInvoke } from '$renderer/ipc';
import StorageIcon from '$icons/buildings/StorageIcon.vue';

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
    <div class="res-area">
        <StorageIcon />
        <span>{{ total.toLocaleString('pt-br') }}</span>
    </div>
</template>

<style scoped lang="scss">
.res-area {
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
    width: 100%;
}
</style>