<script setup lang="ts">
import { useIpcRendererOn } from '@vueuse/electron';
import { NConfigProvider, NLoadingBarProvider, darkTheme } from 'naive-ui';
import TheTopContainer from '$ui/components/TheTopContainer.vue';
import TheLoadingBar from '$ui/components/TheLoadingBar.vue';
import type { ElectronErrorLogBase } from '$types/error';

useIpcRendererOn('notify-electron-error', (_e, err: ElectronErrorLogBase) => {
    new Notification(err.name, { body: err.message });
});
</script>

<template>
    <NConfigProvider :theme="darkTheme">
        <TheTopContainer />
        
        <NLoadingBarProvider>
            <TheLoadingBar />
        </NLoadingBarProvider>
    </NConfigProvider>
</template>

<style scoped>

</style>