<script setup lang="ts">
import { NConfigProvider, darkTheme } from 'naive-ui';
import { useIpcOn } from '$renderer/composables';
import TheTopContainer from '$ui/components/TheTopContainer.vue';

useIpcOn('notify-electron-error', (_e, err: ElectronErrorLogType) => {
    new Notification(err.name, { body: err.message });
});
</script>

<template>
    <NConfigProvider :theme="darkTheme">
        <TheTopContainer />
    </NConfigProvider>
</template>