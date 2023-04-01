<script setup lang="ts">
import { NConfigProvider, NLoadingBarProvider, darkTheme } from 'naive-ui';
import TheTopContainer from '$main/components/TheTopContainer.vue';
import TheLoadingBar from '$main/components/TheLoadingBar.vue';
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