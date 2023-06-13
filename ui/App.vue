<script setup lang="ts">
import { NConfigProvider, NLoadingBarProvider, darkTheme } from 'naive-ui';
import { useIpcOn } from '$renderer/composables';
import TheTopContainer from '$ui/components/TheTopContainer.vue';
import TheLoadingBar from '$ui/components/TheLoadingBar.vue';

useIpcOn('notify-electron-error', (_e, err: ElectronErrorLogType) => {
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