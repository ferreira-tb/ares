<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watchEffect, Transition } from 'vue';
import { RouterView } from 'vue-router';
import { routeNames, router } from '@/router/router.js';
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