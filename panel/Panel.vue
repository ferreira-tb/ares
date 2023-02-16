<script setup lang="ts">
import { watch, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { isString } from '@tb-dev/ts-guard';
import { routeNames, router } from '$panel/router/router.js';
import { useAresStore } from '$vue/stores/ares.js';
import { patchPlunderStore } from '$vue/stores/plunder.js';
import { verifyWorldAndUnitData } from './config.js';

const aresStore = useAresStore();

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    if (aresStore.currentScreen && routeNames.includes(aresStore.currentScreen)) {
        router.push({ name: aresStore.currentScreen });
    } else {
        router.push('/');
    };
});

// Atribui as configurações salvas de acordo com o mundo atual.
watch(() => aresStore.currentWorld, async () => {
    if (!isString(aresStore.currentWorld)) return;
    await Promise.all([
        verifyWorldAndUnitData(aresStore),
        patchPlunderStore()
    ]);
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