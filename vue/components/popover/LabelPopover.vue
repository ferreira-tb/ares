<script setup lang="ts">
import { reactive } from 'vue';
import { NPopover } from 'naive-ui';

interface Props {
    delay?: number;
    animated?: boolean;
    scrollable?: boolean;
    keepAliveOnHover?: boolean;
    maxWidth?: number;
    maxHeight?: number;
};

const props = withDefaults(defineProps<Props>(), {
    delay: 800,
    animated: true,
    scrollable: true,
    keepAliveOnHover: true,
    maxWidth: 250,
    maxHeight: 100
});

const style = reactive({
    maxWidth: `${props.maxWidth}px`,
    maxHeight: `${props.maxHeight}px`
});
</script>

<template>
    <NPopover :delay="props.delay" :animated="props.animated" :scrollable="props.scrollable"
        :keep-alive-on-hover="props.keepAliveOnHover" :style="style">
        <template #trigger>
            <span class="trigger-label">
                <slot name="trigger"></slot>
            </span>
        </template>
        <slot></slot>
    </NPopover>
</template>

<style scoped>
.trigger-label {
    margin-left: 0.5em;
}
</style>