<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { NInputNumber } from 'naive-ui';
import { isInteger } from '@tb-dev/ts-guard';

type Keyboard = {
    ArrowUp?: boolean | undefined;
    ArrowDown?: boolean | undefined;
};

interface Props {
    min?: number;
    max?: number;
    value?: number;
    arrowUp?: boolean;
    arrowDown?: boolean;
    bordered?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    size?: 'tiny' | 'small' | 'medium' | 'large';
    step?: number;
    marginRight?: number;
    validator?: (value: number) => boolean;
};

const props = withDefaults(defineProps<Props>(), {
    min: 1,
    max: 100,
    value: 1,
    arrowUp: false,
    arrowDown: false,
    bordered: true,
    clearable: false,
    disabled: false,
    size: 'medium',
    step: 1,
    validator: isInteger,
    marginRight: 0.5
});

const emit = defineEmits<{
  (e: 'value-updated', inputValue: number): void
}>();

const inputValue = ref(props.value);
watch(inputValue, (value) => {
    if (props.validator(value)) {
        emit('value-updated', value);
    };
});

const keyboardOptions: Keyboard = reactive({
    ArrowUp: props.arrowUp,
    ArrowDown: props.arrowDown
});
</script>

<template>
        <NInputNumber class="standard-number-input"
            v-model:value="inputValue"
            :min="props.min" :max="props.max"
            :keyboard="keyboardOptions"
            :validator="props.validator"
            :bordered="props.bordered"
            :clearable="props.clearable"
            :disabled="props.disabled"
            :size="props.size"
            :step="props.step"
        />
</template>

<style scoped>
.standard-number-input {
    margin-right: v-bind("`${props.marginRight.toString(10)}em`");
}
</style>