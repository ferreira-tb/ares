<script setup lang="ts">
import { computed, ref } from 'vue';
import { NTag } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';

defineProps<{
    userAlias: UserAlias | null;
}>();

const locale = await ipcInvoke('app:locale');

const responseTime = ref<number | null>(null);
responseTime.value = await ipcInvoke('browser:get-response-time');

const responseTimeTagType = computed(() => {
    if (responseTime.value) {
        if (responseTime.value <= 250) return 'success';
        if (responseTime.value <= 1000) return 'warning';
    };

    return 'error';
});

useIpcOn('response-time-did-update', (_e, time: number) => {
    responseTime.value = time;
});
</script>

<template>
    <div class="response-time-tag">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="userAlias && responseTime" :key="responseTimeTagType" class="tag-wrapper">
                <NTag round :type="responseTimeTagType" size="small">
                    {{ `${responseTime.toLocaleString(locale)}ms` }}
                </NTag>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss' as ui;

.response-time-tag {
    @include ui.ui-tag;

    .tag-wrapper {
        @include ui.tag-wrapper;
    }
}
</style>