<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { useIpcRenderer } from '@vueuse/electron';
import { arrayIncludes } from '@tb-dev/ts-guard';
import { NConfigProvider, darkTheme, NSpin } from 'naive-ui';
import { routeNames, router } from '$panel/router/router.js';
import { useAresStore } from '$vue/stores/ares.js';

const aresStore = useAresStore();

const browserIsLoading = ref<boolean>(false);
const ipcRenderer = useIpcRenderer();
ipcRenderer.on('browser-will-navigate', () => browserIsLoading.value = true);
ipcRenderer.on('browser-did-finish-load', () => browserIsLoading.value = false);

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    if (arrayIncludes(routeNames, aresStore.screen)) {
        router.push({ name: aresStore.screen });
    } else {
        router.push('/');
    };
});
</script>

<template>
    <NConfigProvider :theme="darkTheme">
        <RouterView v-slot="{ Component }">
            <template v-if="Component">
                <Transition name="tb-fade" mode="out-in">
                    <Suspense>
                        <component :is="Component" />
                        <template #fallback>
                            <span class="to-center bold-green">Carregando...</span>
                        </template>
                    </Suspense>
                </Transition>
            </template>
        </RouterView>

        <NSpin class="browser-spin" size="small" v-show="browserIsLoading" />
    </NConfigProvider>
</template>