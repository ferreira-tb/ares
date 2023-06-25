<script setup lang="ts">
import { nextTick, ref, toValue } from 'vue';
import { NInputNumber } from 'naive-ui';

const props = defineProps<{
    value: number
}>();

const emit = defineEmits<{
    (e: 'update', newValue: number): void
}>();

const editing = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref(toValue(props.value));

function handleClick() {
    editing.value = true;
    nextTick(() => inputRef.value?.focus());
}

function save() {
    editing.value = false;
    if (validator(inputValue.value)) {
        emit('update', inputValue.value);
    }
}

function validator(v: number) {
    return Number.isInteger(v) && (v >= 0 && v <= 30000);
}
</script>

<template>
    <div @click="handleClick">
        <NInputNumber
            v-if="editing"
            ref="inputRef"
            v-model:value="inputValue"
            :min="0"
            :max="30000"
            :validator="validator"
            @blur="save"
            @keydown.enter="save"
        />
        
        <span v-else>{{ value }}</span>
    </div>
</template>