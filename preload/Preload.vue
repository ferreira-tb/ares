<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { routeNames, router } from '$/router/router.js';
import { usePhobiaStore } from '@/stores/store.js';

const phobiaStore = usePhobiaStore();
const { currentScreen } = storeToRefs(phobiaStore);

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    if (currentScreen.value && routeNames.includes(currentScreen.value)) {
        router.push({ name: currentScreen.value });
    } else {
        router.push('/');
    };
});
</script>

<template>
    <RouterView v-slot="{ Component, route }">
        <Suspense>
            <component :is="Component" :key="route.path" />
        </Suspense>
    </RouterView>
</template>