<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watchEffect, Transition } from 'vue';
import { RouterView } from 'vue-router';
import { ipcRenderer } from 'electron';
import { useCurrentScreen } from '@/composables/game.js';
import { routeNames, router } from '@/router/router.js';
import { usePhobiaStore } from '@/stores/store.js';
import { assert } from '@/error.js';

const phobiaStore = usePhobiaStore();
const { currentURL } = storeToRefs(phobiaStore);
const currentScreen = useCurrentScreen(currentURL);

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    if (currentScreen.value && routeNames.includes(currentScreen.value)) {
        router.push({ name: currentScreen.value });
    } else {
        router.push('/');
    };
});

// Comunicação.
ipcRenderer.on('game-url', (_e, url) => {
    assert(typeof url === 'string', 'A URL é inválida.');
    if (!url.includes('tribalwars')) return;
    currentURL.value = url;
});
</script>

<template>
    <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
        </Transition>
    </RouterView>
</template>

<style scoped>

</style>