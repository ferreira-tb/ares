<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { routeNames, router } from '$panel/router/router.js';
import { useAresStore } from '$vue/stores/ares.js';

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
    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Transition name="fade" mode="out-in">
                <Suspense>
                    <component :is="Component" />
                    <template #fallback>
                        <span class="to-center green-text bold">Carregando...</span>
                    </template>
                </Suspense>
            </Transition>
        </template>
    </RouterView>
</template>

<style scoped>
:global(html) {
    overflow: hidden;
}

:global(body) {
    -webkit-app-region: drag;
}

:global(button) {
    -webkit-app-region: no-drag;
}
</style>