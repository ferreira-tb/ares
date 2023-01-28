<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { routeNames, router } from '$/router/router.js';
import { useAresStore } from '#/vue/stores/store.js';

const aresStore = useAresStore();

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    if (aresStore.currentScreen && routeNames.includes(aresStore.currentScreen)) {
        router.push({ name: aresStore.currentScreen });
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