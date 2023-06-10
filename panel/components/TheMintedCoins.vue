<script setup lang="ts">
import { h } from 'vue';
import { storeToRefs } from 'pinia';
import { NButton } from 'naive-ui';
import { watchImmediate } from '@vueuse/core';
import { useSnobConfigStore, useSnobHistoryStore } from '$renderer/stores';
import { ipcInvoke } from '$renderer/ipc';
import CoinIcon from '$icons/misc/CoinIcon.vue';

const locale = await ipcInvoke('app:locale');

const config = useSnobConfigStore();
const { active } = storeToRefs(config);

const history = useSnobHistoryStore();
const { coins } = storeToRefs(history);

watchImmediate(active, async () => {
    const lastMinted = await ipcInvoke('snob:get-history');
    if (lastMinted) history.$patch(lastMinted);
});
</script>

<template>
    <NButton
        class="minted-amount"
        quaternary
        :keyboard="false"
        :render-icon="() => h(CoinIcon)"
    >
        <span>{{ coins.toLocaleString(locale) }}</span>
    </NButton>
</template>

<style scoped lang="scss">
.minted-amount {
    cursor: default;
}
</style>