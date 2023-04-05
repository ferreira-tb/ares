<script setup lang="ts">
import { reactive } from 'vue';
import { useVModel } from '@vueuse/core';
import { NSwitch } from 'naive-ui';
import LabelPopover from '$global/components/LabelPopover.vue';

interface Props {
    value?: boolean;
    size?: 'large' | 'medium' | 'small';
    round?: boolean;
    disabled?: boolean;
    textAlign?: 'start';
    popDelay?: number;
    popAnimated?: boolean;
    popScrollable?: boolean;
    popKeepAliveOnHover?: boolean;
    popMaxWidth?: number;
    popMaxHeight?: number;
};

const props = withDefaults(defineProps<Props>(), {
    value: false,
    size: 'small',
    round: true,
    disabled: false,
    textAlign: 'start',
    popDelay: 800,
    popAnimated: true,
    popScrollable: true,
    popKeepAliveOnHover: true,
    popMaxWidth: 250,
    popMaxHeight: 100
});

const emit = defineEmits<{
    (e: 'update:value', value: boolean): void
}>();

const value = useVModel(props, 'value', emit);

const popoverStyle = reactive({
    maxWidth: `${props.popMaxWidth}px`,
    maxHeight: `${props.popMaxHeight}px`
});
</script>

<template>
    <div class="switch-popover">
        <NSwitch
            v-model:value="value"
            :size="props.size"
            :round="props.round"
            :disabled="props.disabled"
        />

        <LabelPopover
            :delay="props.popDelay"
            :animated="props.popAnimated"
            :scrollable="props.popScrollable"
            :keep-alive-on-hover="props.popKeepAliveOnHover"
            :style="popoverStyle"
            :display-as-block="false"
        >
            <template #trigger>
                <slot name="trigger"></slot>
            </template>
            <slot></slot>
        </LabelPopover>
    </div>
</template>

<style scoped>
.switch-popover {
    text-align: v-bind("props.textAlign");
}
</style>