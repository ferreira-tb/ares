<script setup lang="ts">
//import { useIpcRenderer } from '@vueuse/electron';
import { isObject } from '@tb-dev/ts-guard';
import ErrorResult from '$vue/components/ErrorResult.vue';
//import { ipcInvoke } from '$global/ipc.js';
// const ipcRenderer = useIpcRenderer();
//const previousConfig = await ipcInvoke('get-plunder-config');
const previousConfig = null;
</script>

<template>
    <section v-if="isObject(previousConfig)">

    </section>
    <ErrorResult v-else description="Não foi possível carregar as configurações do assistente de saque :(" />
</template>

<style scoped>

</style>