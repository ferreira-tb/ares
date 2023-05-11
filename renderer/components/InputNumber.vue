<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useVModel } from '@vueuse/core';
import { NInputNumber } from 'naive-ui';
import { isInteger } from '$global/guards';

type Keyboard = {
    ArrowUp?: boolean | undefined;
    ArrowDown?: boolean | undefined;
};

interface Props {
    value: number;
    min?: number;
    max?: number;
    arrowUp?: boolean;
    arrowDown?: boolean;
    bordered?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    size?: 'large' | 'medium' | 'small' | 'tiny';
    step?: number;
    marginRight?: boolean | number;
    validator?: (value: number) => boolean;
};

const props = withDefaults(defineProps<Props>(), {
    min: 1,
    max: 100,
    arrowUp: false,
    arrowDown: false,
    bordered: true,
    clearable: false,
    disabled: false,
    size: 'medium',
    step: 1,
    marginRight: 0.5,
    validator: isInteger
});

const emit = defineEmits<{
    (e: 'update:value', value: number): void
}>();

const value = useVModel(props, 'value', emit);

const keyboardOptions: Keyboard = reactive({
    ArrowUp: props.arrowUp,
    ArrowDown: props.arrowDown
});

const computedMarginRight = computed(() => {
    if (props.marginRight === true) {
        return '0.5em';
    } else if (props.marginRight === false) {
        return '0';
    };

    return `${props.marginRight.toString(10)}em`;
});
</script>

<template>
        <NInputNumber
            v-model:value="value"
            class="standard-number-input"
            :min="props.min"
            :max="props.max"
            :keyboard="keyboardOptions"
            :bordered="props.bordered"
            :clearable="props.clearable"
            :disabled="props.disabled"
            :size="props.size"
            :step="props.step"
            :validator="props.validator"
        />
</template>

<style scoped lang="scss">
.standard-number-input {
    margin-right: v-bind("computedMarginRight");
}
</style>