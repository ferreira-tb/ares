<script setup lang="ts">
import { useAsyncState } from '@vueuse/core';
import { NEllipsis } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import type { VNodeChild } from 'vue';

defineProps<{
    icon: () => VNodeChild;
    amount: number;
}>();

const { state: locale } = useAsyncState(ipcInvoke('app:locale'), 'pt-br');
</script>

<template>
	<div class="label-amount">
        <component :is="icon" />
        <span class="amount">
            <NEllipsis :tooltip="false">
                {{ amount.toLocaleString(locale) }}
            </NEllipsis>
        </span>
    </div>
</template>

<style scoped lang="scss">
@use '$renderer/assets/mixins.scss';

.label-amount {
    @include mixins.flex-x-start-y-center;

    .amount {
        margin-left: 8px;
    }
}
</style>