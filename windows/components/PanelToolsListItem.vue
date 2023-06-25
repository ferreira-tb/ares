<script setup lang="ts">
import { NButton, NEllipsis, NListItem, NThing } from 'naive-ui';

defineProps<{
    title: string;
    buttonText: string;
}>();

defineEmits<{
    (e: 'click'): void;
}>();
</script>

<template>
	<div class="panel-tools-list-item">
        <NListItem>
            <div class="list-item-thing">
                <NThing>
                    <template #header>
                        <NEllipsis class="list-item-title" :tooltip="false">{{ title }}</NEllipsis>
                    </template>

                    <span class="list-item-slot">
                        <slot></slot>
                    </span>
                </NThing>
            </div>
    
            <template #suffix>
                <NButton @click="$emit('click')">
                    {{ buttonText }}
                </NButton>
            </template>
        </NListItem>
    </div>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

.panel-tools-list-item {
    height: 120px;
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    padding: 0.5em;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: rgba(255, 255, 255, 0.09);
    }

    .list-item-thing {
        padding-left: 0.5em;
    }

    .list-item-title {
        @include main.bold-text-color($font-weight: 500)
    }

    .list-item-slot {
        font-size: 0.8em;
    }
}
</style>