<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { NResult } from 'naive-ui';
import { watchImmediate } from '@vueuse/core';
import { useAresStore } from '$renderer/stores/ares';
import { usePlunderConfigStore } from '$renderer/stores/plunder';
import { router } from '$panel/router';
import { ipcSend } from '$renderer/ipc';

const aresStore = useAresStore();
const plunderConfigStore = usePlunderConfigStore();

const { captcha } = storeToRefs(aresStore);

watchImmediate(captcha, (isActive) => {
    if (isActive && router.currentRoute.value.name === 'am_farm') {
        plunderConfigStore.active = false;
        ipcSend('plunder:save-history');
    };
});
</script>

<template>
    <main>
        <NResult
            status="warning"
            size="small"
            title="Há um captcha ativo!"
            description="Não será possível usar o Ares até que ele seja removido."
        />
    </main>
</template>

<style scoped>
main {
    margin-top: 1.5rem;
}
</style>