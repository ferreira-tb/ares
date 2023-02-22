<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { NSwitch } from 'naive-ui';
import { isBoolean } from '@tb-dev/ts-guard';
import Popover from '$vue/components/popover/Popover.vue';

interface Props {
    value?: boolean;
    size?: 'small' | 'medium' | 'large';
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
    (e: 'switch-updated', value: boolean): void
}>();

const switchValue = ref(props.value);
watch(switchValue, (value) => {
    if (isBoolean(value)) {
        emit('switch-updated', value);
    };
});

const popoverStyle = reactive({
    maxWidth: `${props.popMaxWidth}px`,
    maxHeight: `${props.popMaxHeight}px`
});
</script>

<template>
    <div class="switch-popover">
        <NSwitch
            v-model:value="switchValue"
            :size="props.size"
            :round="props.round"
            :disabled="props.disabled"
        />

        <Popover
            :delay="props.popDelay"
            :animated="props.popAnimated"
            :scrollable="props.popScrollable"
            :keep-alive-on-hover="props.popKeepAliveOnHover"
            :style="popoverStyle"
            :trigger-is-label="true"
        >
            <template #trigger>
                <slot name="trigger"></slot>
            </template>
            <slot></slot>
        </Popover>
    </div>
</template>

<style scoped>
.switch-popover {
    text-align: v-bind("props.textAlign");
}
</style>