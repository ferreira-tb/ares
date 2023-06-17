<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { useArrayIncludes, watchImmediate, whenever } from '@vueuse/core';
import { IpcTribal } from '$ipc/interface';
import { routeNames, router } from '$browser/router';
import { useCacheStore, useGameDataStore } from '$renderer/stores';
import { useBrowserStore } from '$browser/stores';
import { ipcSend } from '$renderer/ipc';
import { gameOriginRegex } from '$common/regex';
import TheIpcTribalTag from '$browser/components/TheIpcTribalTag.vue';
import TheCaptchaObserver from '$browser/components/TheCaptchaObserver.vue';
import TheIncomingsObserver from '$browser/components/TheIncomingsObserver.vue';

const browser = useBrowserStore();
const cache = useCacheStore();
const gameData = useGameDataStore();

const { screen } = storeToRefs(gameData);
const { isIpcTribalReady } = storeToRefs(browser);

// Define a janela de acordo com a página atual no jogo.
const isValidRoute = useArrayIncludes(routeNames, screen);
watchImmediate(screen, async (name) => {
    if (name && isValidRoute.value) {
        await router.push({ name });
    } else {
        await router.push('/');
    };
});

whenever(isIpcTribalReady, async () => {
    if (gameOriginRegex.test(location.origin)) {
        const responseTime = await IpcTribal.invoke('get-response-time');
        ipcSend('browser:update-response-time', responseTime);
        cache.responseTime = responseTime;
    };
});
</script>

<template>
    <Suspense>
        <TheIpcTribalTag />
    </Suspense>
    
    <TheCaptchaObserver />
    
    <template v-if="isIpcTribalReady">
        <Suspense>
            <TheIncomingsObserver />
        </Suspense>
    </template>

    <RouterView #default="{ Component }">
        <template v-if="Component">
            <Suspense>
                <component :is="Component" />
            </Suspense>
        </template>
    </RouterView>
</template>