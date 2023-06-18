<script setup lang="ts">
defineProps<{
    title: string;
    description: string;
}>();
</script>

<template>
    <div class="group-template-card">
        <div class="card-title">{{ title }}</div>
        <div class="card-description">{{ description }}</div>
        <div class="card-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

.group-template-card {
    @include main.flex-x-center-y-center;
    flex-direction: column;
    width: 100%;
    
    .card-title {
        font-size: 1.2em;
        font-weight: bold;
        color: var(--color-green);
    }

    .card-description {
        font-size: 0.8em;
        margin-top: 0.5em;
    }

    .card-content {
        @include main.flex-x-center-y-center;
        margin-top: 1em;
    }
}
</style>