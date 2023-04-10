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

const { captcha, screen: screenName } = storeToRefs(aresStore);
const { isVisible } = storeToRefs(panelStore);

// Define a janela de acordo com a página atual no jogo.
const isValidRoute = useArrayIncludes(routeNames, screenName);
watchImmediate(screenName, async (currentScreen) => {
    if (isValidRoute.value) {
        await router.push({ name: currentScreen });
    } else {
        await router.push('/');
    };
});
</script>

<template>
    <NConfigProvider :theme="darkTheme">
        <template v-if="isVisible">
            <CaptchaView v-if="captcha" />

            <RouterView v-else #default="{ Component }">
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
        </template>

        <HomeView v-else />
    </NConfigProvider>
</template>