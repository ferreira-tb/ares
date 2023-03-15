<script setup lang="ts">
import { NConfigProvider, NLoadingBarProvider, darkTheme } from 'naive-ui';
import TopContainer from '$main/components/TopContainer.vue';
</script>

<template>
    <NConfigProvider :theme="darkTheme">
        <NLoadingBarProvider>
            <TopContainer />
        </NLoadingBarProvider>
    </NConfigProvider>
</template>

<style scoped>

</style>