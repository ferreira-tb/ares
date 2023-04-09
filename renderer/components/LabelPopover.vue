<script setup lang="ts">
import { computed, reactive } from 'vue';
import { NPopover } from 'naive-ui';

interface Props {
    delay?: number;
    animated?: boolean;
    scrollable?: boolean;
    keepAliveOnHover?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    displayAsBlock?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    delay: 800,
    animated: true,
    scrollable: true,
    keepAliveOnHover: true,
    maxWidth: 250,
    maxHeight: 100,
    displayAsBlock: true
});

const triggerElement = computed(() => props.displayAsBlock ? 'div' : 'span');

const style = reactive({
    maxWidth: `${props.maxWidth}px`,
    maxHeight: `${props.maxHeight}px`
});
</script>

<template>
    <NPopover
        :delay="props.delay"
        :animated="props.animated"
        :scrollable="props.scrollable"
        :keep-alive-on-hover="props.keepAliveOnHover"
        :style="style"
    >
        <template #trigger>
            <component :is="triggerElement" class="trigger-label" :class="{ 'flex-center-y': props.displayAsBlock }">
                <slot name="trigger"></slot>
            </component>
        </template>
        <slot></slot>
    </NPopover>
</template>

<style scoped lang="scss">
@use '$assets/utils.scss';

.trigger-label {
    margin-left: 0.5em;
}

.flex-center-y {
    @include utils.flex-center-y;
}
</style>