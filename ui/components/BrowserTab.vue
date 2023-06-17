<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { NEllipsis, NSpin } from 'naive-ui';
import { useBrowserTab } from '$ui/composables';
import { ipcSend } from '$renderer/ipc';
import LightIcon18 from '$icons/units/LightIcon18.vue';

const props = defineProps<{
    id: number;
    isMainTab: boolean;
}>();

const browserTab = ref<HTMLDivElement | null>(null);
const { title, favicon, isLoading } = useBrowserTab(props.id);

const tabTitle = computed(() => {
    if (props.isMainTab) return 'Ares';
    return title.value ?? 'Ares';
});

useEventListener(browserTab, 'contextmenu', (e) => {
    if (props.isMainTab) return;

    e.preventDefault();
    e.stopPropagation();
    ipcSend('tab:show-context-menu', props.id);
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
                {{ tabTitle }}
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