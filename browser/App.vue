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
import { gameOriginRegex } from '$global/utils/constants';
import { BrowserRouterError } from '$browser/error';
import TheDeimosTag from '$browser/components/TheDeimosTag.vue';
import TheCaptchaObserver from '$browser/components/TheCaptchaObserver.vue';

const aresStore = useAresStore();
const browserStore = useBrowserStore();

const { screen: currentScreen } = storeToRefs(aresStore);
const { isDeimosReady } = storeToRefs(browserStore);

// Define a janela de acordo com a página atual no jogo.
watchEffect(async () => {
    try {
        const screen = currentScreen.value;
        if (screen && arrayIncludes(routeNames, screen)) {
            await router.push({ name: screen });
        } else {
            await router.push('/');
        };
        
    } catch (err) {
        BrowserRouterError.catch(err);
    };
});

whenever(isDeimosReady, async () => {
    if (gameOriginRegex.test(location.origin)) {
        const responseTime = await Deimos.invoke('get-response-time');
        ipcSend('update-response-time', responseTime);
        aresStore.responseTime = responseTime;
    };
});
</script>

<template>
    <TheCaptchaObserver />

    <Suspense>
        <TheDeimosTag />
    </Suspense>

    <RouterView #default="{ Component }">
        <template v-if="Component">
            <Suspense>
                <component :is="Component" />
            </Suspense>
        </template>
    </RouterView>
</template>