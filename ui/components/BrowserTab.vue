<script setup lang="ts">
import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { NEllipsis, NSpin } from 'naive-ui';
import { useIpcOn } from '$renderer/composables';
import { ipcSend } from '$renderer/ipc';
import LightIcon18 from '$icons/units/LightIcon18.vue';

const props = defineProps<{
    id: number;
    isMainTab: boolean;
}>();

const browserTab = ref<HTMLDivElement | null>(null);
const title = ref('Nova aba');
const favicon = ref<string | null>(null);
const isLoading = ref(false);

useEventListener(browserTab, 'contextmenu', (e) => {
    if (props.isMainTab) return;

    e.preventDefault();
    e.stopPropagation();
    ipcSend('tab:show-context-menu', props.id);
});

useIpcOn('tab:loading-status', (_e, loadingTabId: number, status: boolean) => {
    if (props.id !== loadingTabId) return;
    isLoading.value = status;
});

useIpcOn('tab:did-update-title', (_e, updatedTabId: number, newTitle: string) => {
    if (props.id !== updatedTabId) return;
    title.value = newTitle;
});

useIpcOn('tab:did-update-favicon', (_e, updatedTabId: number, newFavicon: string) => {
    if (props.id !== updatedTabId) return;
    favicon.value = newFavicon;
});
</script>

<template>
    <div ref="browserTab" class="browser-tab">
        <div class="tab-favicon">
            <Transition name="tb-fade" mode="out-in">
                <NSpin v-if="isLoading" :size="16" />
                <LightIcon18 v-else-if="!favicon" />
                <img v-else :src="favicon">
            </Transition>
        </div>
        
        <div class="tab-title">
            <NEllipsis :tooltip="false">
                {{ props.isMainTab ? 'Ares' : title }}
            </NEllipsis>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss';

.browser-tab {
    @include main.flex-x-start-y-center;

    .tab-favicon {
        @include main.flex-x-start-y-center;
        width: 20px;

        img {
            width: 16px;
            height: 16px;
        }
    }

    .tab-title {
        margin-left: 5px;
        width: v-bind("isMainTab ? 'max-content' : '150px'");
    }
}
</style>