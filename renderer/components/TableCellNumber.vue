<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { NInputNumber } from 'naive-ui';
import { isInteger } from '$common/guards';

type Keyboard = {
    ArrowUp?: boolean | undefined;
    ArrowDown?: boolean | undefined;
};

interface NumberCellProps {
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
    showButton?: boolean;
    readonly?: boolean;
    validator?: (value: number) => boolean;
}

const props = withDefaults(defineProps<NumberCellProps>(), {
    min: 0,
    max: 30000,
    arrowUp: true,
    arrowDown: true,
    bordered: true,
    clearable: false,
    disabled: false,
    size: 'medium',
    step: 1,
    showButton: false,
    readonly: false,
    validator: (value: unknown) => isInteger(value) && value >= 0 && value <= 30000
});

const emit = defineEmits<{
    (e: 'cell-updated', newValue: number): void
}>();

const isEdit = ref<boolean>(false);
const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref(props.value);

const keyboardOptions: Keyboard = reactive({
    ArrowUp: props.arrowUp,
    ArrowDown: props.arrowDown
});

async function handleClick() {
    isEdit.value = true;
    await nextTick();
    inputRef.value?.focus();
}

function endEditMode() {
    isEdit.value = false;
    if (props.validator(inputValue.value)) {
        emit('cell-updated', inputValue.value);
    }
}
</script>

<template>
    <div @click="handleClick">
        <NInputNumber
            v-if="isEdit"
            ref="inputRef"
            v-model:value="inputValue"
            :min="props.min"
            :max="props.max"
            :keyboard="keyboardOptions"
            :bordered="props.bordered"
            :clearable="props.clearable"
            :disabled="props.disabled"
            :size="props.size"
            :step="props.step"
            :show-button="props.showButton"
            :readonly="props.readonly"
            :validator="props.validator"
            @blur="endEditMode"
            @keydown.enter="endEditMode"
        />
        
        <span v-else>{{ props.value }}</span>
    </div>
</template>