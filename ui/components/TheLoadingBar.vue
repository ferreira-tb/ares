<script setup lang="ts">
import { useLoadingBar } from 'naive-ui';
import { useIpcOn } from '$renderer/composables';

const loadingBar = useLoadingBar();

useIpcOn('current-view:did-start-loading', () => {
    loadingBar.start();
});

useIpcOn('current-view:did-stop-loading', () => {
    loadingBar.finish();
});
</script>

<template>
    <div></div>
</template>