<script setup lang="ts">
import WindowTabs from '$main/components/WindowTabs.vue';
import WindowMenu from '$main/components/WindowMenu.vue';
</script>

<template>
    <div class="main-window-interface">
        <WindowTabs />
        <WindowMenu />
    </div>
</template>

<style scoped>
.main-window-interface {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    user-select: none;
}
</style>