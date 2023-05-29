<script setup lang="ts">
import { reactive } from 'vue';
import { useVModel } from '@vueuse/core';
import { NInputNumber } from 'naive-ui';
import { isWallLevel, assertWallLevel } from '$shared/guards';
import { RendererProcessError } from '$renderer/error';

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
    marginRight?: number;
};

const props = withDefaults(defineProps<Props>(), {
    min: 1,
    max: 20,
    arrowUp: false,
    arrowDown: false,
    bordered: true,
    clearable: false,
    disabled: false,
    size: 'medium',
    step: 1,
    marginRight: 0.5
});

const emit = defineEmits<{
    (e: 'update:value', wallLevel: number): void
}>();

const value = useVModel(props, 'value', emit);

const keyboardOptions: Keyboard = reactive({
    ArrowUp: props.arrowUp,
    ArrowDown: props.arrowDown
});

assertWallLevel(props.min, RendererProcessError);
assertWallLevel(props.max, RendererProcessError);
assertWallLevel(props.value, RendererProcessError);
</script>

<template>
        <NInputNumber
            v-model:value="value"
            class="wall-input"
            :min="props.min"
            :max="props.max"
            :keyboard="keyboardOptions"
            :validator="isWallLevel"
            :bordered="props.bordered"
            :clearable="props.clearable"
            :disabled="props.disabled"
            :size="props.size"
            :step="props.step"
        />
</template>

<style scoped lang="scss">
.wall-input {
    margin-right: v-bind("`${props.marginRight.toString(10)}em`");
}
</style>