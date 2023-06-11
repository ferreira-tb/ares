<script setup lang="ts">
defineProps<{
    readonly src: string;
    readonly alt: string;
}>();
</script>

<template>
    <div :class="$style['flex-image']">
        <img :src="src" :alt="alt">
    </div>
</template>

<style module>
.flex-image {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>