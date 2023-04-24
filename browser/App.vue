<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { useArrayIncludes, watchImmediate, whenever } from '@vueuse/core';
import { Deimos } from '$deimos/interface/ipc';
import { routeNames, router } from '$browser/router/router';
import { useAresStore } from '$renderer/stores/ares';
import { useBrowserStore } from '$browser/stores/browser';
import { ipcSend } from '$renderer/ipc';
import { gameOriginRegex } from '$global/regex';
import TheDeimosTag from '$browser/components/TheDeimosTag.vue';
import TheCaptchaObserver from '$browser/components/TheCaptchaObserver.vue';

const aresStore = useAresStore();
const browserStore = useBrowserStore();

const { screen: currentScreen } = storeToRefs(aresStore);
const { isDeimosReady } = storeToRefs(browserStore);

// Define a janela de acordo com a página atual no jogo.
const isValidRoute = useArrayIncludes(routeNames, currentScreen);
watchImmediate(currentScreen, async (name) => {
    if (name && isValidRoute.value) {
        await router.push({ name });
    } else {
        await router.push('/');
    };
});

whenever(isDeimosReady, async () => {
    if (gameOriginRegex.test(location.origin)) {
        const responseTime = await Deimos.invoke('get-response-time');
        ipcSend('browser:update-response-time', responseTime);
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