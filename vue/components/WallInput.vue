<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
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
    arrowUp: false,
    arrowDown: false,
    bordered: true,
    clearable: false,
    disabled: false,
    size: 'medium',
    step: 1
});

const emit = defineEmits<{
  (e: 'level-updated', wallLevel: number): void
}>();

const inputValue = ref(props.value);
watch(inputValue, (value) => {
    if (isWallLevel(value)) {
        emit('level-updated', value);
    };
});

const keyboardOptions: Keyboard = reactive({
    ArrowUp: props.arrowUp,
    ArrowDown: props.arrowDown
});

assertWallLevel(props.min, AresError);
assertWallLevel(props.max, AresError);
assertWallLevel(props.value, AresError);
</script>

<template>
        <NInputNumber
            v-model:value="inputValue"
            :min="props.min" :max="props.max"
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