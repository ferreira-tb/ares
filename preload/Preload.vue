<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { routeNames, router } from '$/router/router.js';
import { usePhobiaStore } from '@/stores/store.js';

const phobiaStore = usePhobiaStore();

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    if (phobiaStore.currentScreen && routeNames.includes(phobiaStore.currentScreen)) {
        router.push({ name: phobiaStore.currentScreen });
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