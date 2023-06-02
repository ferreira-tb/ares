<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { useArrayIncludes, watchImmediate, whenever } from '@vueuse/core';
import { IpcTribal } from '$ipc/interface';
import { routeNames, router } from '$browser/router/router';
import { useAresStore } from '$renderer/stores/ares';
import { useBrowserStore } from '$browser/stores/browser';
import { ipcSend } from '$renderer/ipc';
import { gameOriginRegex } from '$shared/regex';
import TheIpcTribalTag from '$browser/components/TheIpcTribalTag.vue';
import TheCaptchaObserver from '$browser/components/TheCaptchaObserver.vue';
import TheIncomingsObserver from '$browser/components/TheIncomingsObserver.vue';

const aresStore = useAresStore();
const browserStore = useBrowserStore();

const { screen: currentScreen } = storeToRefs(aresStore);
const { isIpcTribalReady } = storeToRefs(browserStore);

// Define a janela de acordo com a página atual no jogo.
const isValidRoute = useArrayIncludes(routeNames, currentScreen);
watchImmediate(currentScreen, async (name) => {
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
        aresStore.responseTime = responseTime;
    };
});
</script>

<template>
    <TheCaptchaObserver />
    <TheIncomingsObserver />

    <Suspense>
        <TheIpcTribalTag />
    </Suspense>

    <RouterView #default="{ Component }">
        <template v-if="Component">
            <Suspense>
                <component :is="Component" />
            </Suspense>
        </template>
    </RouterView>
</template>