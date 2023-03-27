<script setup lang="ts">
import { watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { whenever } from '@vueuse/core';
import { arrayIncludes } from '@tb-dev/ts-guard';
import { Deimos } from '$deimos/shared/ipc';
import { routeNames, router } from '$browser/router/router';
import { useAresStore } from '$global/stores/ares';
import { useBrowserStore } from '$browser/stores/browser';
import { ipcSend } from '$global/ipc';
import { gameURLRegex } from '$global/utils/constants';
import DeimosTag from '$browser/components/DeimosTag.vue';
import CaptchaObserver from '$browser/components/CaptchaObserver.vue';

const aresStore = useAresStore();
const browserStore = useBrowserStore();

const { screen: currentScreen } = storeToRefs(aresStore);
const { isDeimosReady } = storeToRefs(browserStore);

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    const screen = currentScreen.value;
    if (screen && arrayIncludes(routeNames, screen)) {
        router.push({ name: screen });
    } else {
        router.push('/');
    };
});

whenever(isDeimosReady, async () => {
    if (gameURLRegex.test(location.href)) {
        const responseTime = await Deimos.invoke('get-response-time');
        ipcSend('update-response-time', responseTime);
        aresStore.responseTime = responseTime;
    };
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