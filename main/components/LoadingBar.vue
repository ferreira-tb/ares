<script setup lang="ts">
import { useIpcRenderer } from '@vueuse/electron';
import { useLoadingBar } from 'naive-ui';

const loadingBar = useLoadingBar();
const ipcRenderer = useIpcRenderer();

ipcRenderer.on('current-view-did-start-loading', () => {
    loadingBar.start();
});

ipcRenderer.on('current-view-did-stop-loading', () => {
    loadingBar.finish();
});
</script>

<template>
    <div></div>
</template>

<style scoped>
</style>