<script setup lang="ts">
import { h } from 'vue';
import { NButton } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { useSnobConfigStore } from '$renderer/stores';
import { ipcInvoke } from '$renderer/ipc';
import CoinIcon from '$icons/misc/CoinIcon.vue';

const locale = await ipcInvoke('app:locale');
const config = useSnobConfigStore();
const { coins } = storeToRefs(config);
</script>

<template>
    <NButton
        class="coined-amount"
        quaternary
        :keyboard="false"
        :render-icon="() => h(CoinIcon)"
    >
        <span>{{ coins.toLocaleString(locale) }}</span>
    </NButton>
</template>

<style scoped lang="scss">
.coined-amount {
    cursor: default;
}
</style>