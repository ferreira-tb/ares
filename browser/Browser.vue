<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { arrayIncludes } from '@tb-dev/ts-guard';
import { routeNames, router } from '$browser/router/router';
import { useAresStore } from '$vue/stores/ares';
import { getPlunderInfo } from '$lib/plunder/info';
import DeimosTag from '$browser/components/DeimosTag.vue';
import CaptchaObserver from '$browser/components/CaptchaObserver.vue';

const aresStore = useAresStore();

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    const screen = aresStore.screen;
    if (screen && arrayIncludes(routeNames, screen)) {
        router.push({ name: screen });
    } else {
        router.push('/');
    };

    if (screen === 'am_farm') getPlunderInfo();
});
</script>

<template>
    <CaptchaObserver />

    <Suspense>
        <DeimosTag />
    </Suspense>

    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Suspense>
                <component :is="Component" />
            </Suspense>
        </template>
    </RouterView>
</template>