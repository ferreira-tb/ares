<script setup lang="ts">
import { watch, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { routeNames, router } from '@/router/router.js';
import { usePhobiaStore, updateCurrentWorld } from '@/stores/store.js';
import { patchPlunderStore } from '@/stores/plunder.js';

const phobiaStore = usePhobiaStore();

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    if (phobiaStore.currentScreen && routeNames.includes(phobiaStore.currentScreen)) {
        router.push({ name: phobiaStore.currentScreen });
    } else {
        router.push('/');
    };
});

watch(() => phobiaStore.currentURL, async () => await updateCurrentWorld());

// Atribui as configurações salvas.
watch(() => phobiaStore.currentWorld, async () => {
    if (phobiaStore.currentWorld === null) return;
    await patchPlunderStore();
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

<style scoped>

</style>