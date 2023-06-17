<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { useArrayIncludes, watchImmediate } from '@vueuse/core';
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui';
import { routeNames, router } from '$panel/router';
import { useCacheStore, useGameDataStore } from '$renderer/stores';
import { usePanelVisibility } from '$renderer/composables';
import HomeView from '$panel/views/HomeView.vue';
import CaptchaView from '$panel/views/CaptchaView.vue';

const cache = useCacheStore();
const gameData = useGameDataStore();

const { captcha } = storeToRefs(cache);
const { screen } = storeToRefs(gameData);
const { isVisible } = usePanelVisibility();

// Define a janela de acordo com a página atual no jogo.
const isValidRoute = useArrayIncludes(routeNames, screen);
watchImmediate(screen, async (name) => {
    if (name && isValidRoute.value) {
        await router.push({ name });
    } else {
        await router.push('/');
    };
});
</script>

<template>
    <div class="app-container">
        <NConfigProvider :theme="darkTheme">
            <div v-if="isVisible" class="app-container">
                <CaptchaView v-if="captcha" />
                
                <div v-else class="app-container">
                    <RouterView #default="{ Component }">
                        <NMessageProvider>
                            <template v-if="Component">
                                <Transition name="tb-fade" mode="out-in">
                                    <Suspense>
                                        <component :is="Component" />
                                        <template #fallback>
                                            <span class="bold-green to-center">Carregando...</span>
                                        </template>
                                    </Suspense>
                                </Transition>
                            </template>
                        </NMessageProvider>
                    </RouterView>
                </div>
            </div>
            <HomeView v-else />
        </NConfigProvider>
    </div>
</template>

<style scoped lang="scss">
.app-container {
    width: 100%;
    height: 100%;
}
</style>