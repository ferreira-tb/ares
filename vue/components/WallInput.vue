<script setup lang="ts">
import { reactive } from 'vue';
import { NInputNumber } from 'naive-ui';
import { isWallLevel, assertWallLevel } from '$global/utils/guards.js';
import { AresError } from '$global/error.js';

type Keyboard = {
    ArrowUp?: boolean | undefined;
    ArrowDown?: boolean | undefined;
};

interface Props {
    min?: number;
    max?: number;
    value?: number;
    defaultValue?: number;
    arrowUp?: boolean;
    arrowDown?: boolean;
    bordered?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    size?: 'tiny' | 'small' | 'medium' | 'large';
    step?: number;
};

const props = withDefaults(defineProps<Props>(), {
    min: 1,
    max: 20,
    value: 1,
    defaultValue: 1,
    arrowUp: false,
    arrowDown: false,
    bordered: true,
    clearable: false,
    disabled: false,
    size: 'medium',
    step: 1
});

const emit = defineEmits<{
  (e: 'update-level', wallLevel: number): void
}>();

const keyboardOptions: Keyboard = reactive({
    ArrowUp: props.arrowUp,
    ArrowDown: props.arrowDown
});

assertWallLevel(props.min, AresError);
assertWallLevel(props.max, AresError);
assertWallLevel(props.value, AresError);
assertWallLevel(props.defaultValue, AresError);

function updateWallLevel(value: number | null) {
    if (isWallLevel(value)) {
        emit('update-level', value);
    };
};
</script>

<template>
        <NInputNumber
            @update:value="updateWallLevel"
            :min="props.min" :max="props.max"
            :default-value="props.defaultValue"
            :keyboard="keyboardOptions"
            :validator="isWallLevel"
            :bordered="props.bordered"
            :clearable="props.clearable"
            :disabled="props.disabled"
            :size="props.size"
            :step="props.step"
        />
</template>

<style scoped>

</style>