<script setup lang="ts">
import { watch, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { routeNames, router } from '@/router/router.js';
import { usePhobiaStore, updateCurrentWorld } from '@/stores/store.js';
import { patchPlunderStore } from '@/stores/plunder.js';
import { verifyWorldAndUnitData } from '@/api/config.js';

const phobiaStore = usePhobiaStore();

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    if (phobiaStore.currentScreen && routeNames.includes(phobiaStore.currentScreen)) {
        router.push({ name: phobiaStore.currentScreen });
    } else {
        router.push('/');
    };
});

// Atualiza o mundo atual sempre que a URL da página muda.
watch(() => phobiaStore.currentURL, async () => {
    await updateCurrentWorld();
});

// Atribui as configurações salvas de acordo com o mundo atual.
watch(() => phobiaStore.currentWorld, async () => {
    if (phobiaStore.currentWorld === null) return;
    await Promise.all([
        verifyWorldAndUnitData(phobiaStore),
        patchPlunderStore()
    ]);
});
</script>

<template>
    <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
            <Suspense>
                <component :is="Component" :key="route.path" />
                <template #fallback class="to-center green-text bold">
                    Carregando...
                </template>
            </Suspense>
        </Transition>
    </RouterView>
</template>