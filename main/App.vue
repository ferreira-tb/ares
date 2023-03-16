<script setup lang="ts">
import { NConfigProvider, NLoadingBarProvider, darkTheme } from 'naive-ui';
import TopContainer from '$main/components/TopContainer.vue';
import LoadingBar from '$main/components/LoadingBar.vue';
</script>

<template>
    <NConfigProvider :theme="darkTheme">
        <TopContainer />
        
        <NLoadingBarProvider>
            <LoadingBar />
        </NLoadingBarProvider>
    </NConfigProvider>
</template>

<style scoped>

</style>