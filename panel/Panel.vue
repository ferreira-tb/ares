<script setup lang="ts">
import { watch, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { routeNames, router } from './router/router.js';
import { useAresStore, updateCurrentWorld } from '#/vue/stores/store.js';
import { patchPlunderStore } from '#/vue/stores/plunder.js';
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

// Atualiza o mundo atual sempre que a URL da página muda.
watch(() => aresStore.currentURL, async () => {
    await updateCurrentWorld();
});

// Atribui as configurações salvas de acordo com o mundo atual.
watch(() => aresStore.currentWorld, async () => {
    if (aresStore.currentWorld === null) return;
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
                    <template #fallback class="to-center green-text bold">
                        Carregando...
                    </template>
                </Suspense>
            </Transition>
        </template>
    </RouterView>
</template>