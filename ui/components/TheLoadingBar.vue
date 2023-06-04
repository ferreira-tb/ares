<script setup lang="ts">
import { useLoadingBar } from 'naive-ui';
import { useIpcRendererOn } from '@vueuse/electron';

const loadingBar = useLoadingBar();

useIpcRendererOn('current-view:did-start-loading', () => {
    loadingBar.start();
});

useIpcRendererOn('current-view:did-stop-loading', () => {
    loadingBar.finish();
});
</script>

<template>
    <div></div>
</template>