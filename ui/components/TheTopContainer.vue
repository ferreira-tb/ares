<script setup lang="ts">
import { Dimensions } from '$global/constants';
import WindowTabs from '$ui/components/WindowTabs.vue';
import WindowMenu from '$ui/components/WindowMenu.vue';
</script>

<template>
    <div class="main-window-interface">
        <Suspense><WindowTabs /></Suspense>
        <Suspense><WindowMenu /></Suspense>
    </div>
</template>

<style scoped lang="scss">
.main-window-interface {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    height: v-bind("`${Dimensions.TopContainerHeight}px`");
    user-select: none;
    -webkit-app-region: drag;
}
</style>