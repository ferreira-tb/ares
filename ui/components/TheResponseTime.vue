<script setup lang="ts">
import { computed, ref } from 'vue';
import { useIpcRendererOn } from '@vueuse/electron';
import { NTag } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';

const responseTime = ref<number | null>(null);
responseTime.value = await ipcInvoke('browser:get-response-time');

const responseTimeTagType = computed(() => {
    if (responseTime.value) {
        if (responseTime.value <= 250) return 'success';
        if (responseTime.value <= 1000) return 'warning';
    };

    return 'error';
});

useIpcRendererOn('response-time-did-update', (_e, time: number) => {
    responseTime.value = time;
});
</script>

<template>
    <div class="response-time-tag">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="responseTime" :key="responseTimeTagType" class="tag-wrapper">
                <NTag round :type="responseTimeTagType" size="small">
                    {{ `${responseTime}ms` }}
                </NTag>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.response-time-tag {
    width: max-content;
    height: 100%;

    .tag-wrapper {
        display: flex;
        align-items: center;
        justify-content: end;
        
        width: inherit;
        height: inherit;
        padding-right: 0.5rem;
    }
}
</style>