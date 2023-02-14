<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { routeNames, router } from '$browser/router/router.js';
import { useAresStore } from '$vue/stores/ares.js';
import ScriptTag from '$browser/components/ScriptTag.vue';

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
    <Suspense>
        <ScriptTag />
    </Suspense>

    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Suspense>
                <component :is="Component" />
            </Suspense>
        </template>
    </RouterView>
</template>