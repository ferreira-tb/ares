<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { useArrayIncludes, watchImmediate } from '@vueuse/core';
import { NConfigProvider, darkTheme } from 'naive-ui';
import { routeNames, router } from '$panel/router';
import { useAresStore } from '$renderer/stores/ares';
import { usePanelStore } from '$panel/stores/panel';
import HomeView from '$panel/views/HomeView.vue';
import CaptchaView from '$panel/views/CaptchaView.vue';

const aresStore = useAresStore();
const panelStore = usePanelStore();

const { captcha, screen: currentScreen } = storeToRefs(aresStore);
const { isVisible } = storeToRefs(panelStore);

// Define a janela de acordo com a página atual no jogo.
const isValidRoute = useArrayIncludes(routeNames, currentScreen);
watchImmediate(currentScreen, async (name) => {
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
                    </RouterView>
                </div>
            </div>
            <HomeView v-else />
        </NConfigProvider>
    </div>
</template>

<style scoped>
.app-container {
    width: 100%;
    height: 100%;
}
</style>