<script setup lang="ts">
import { watchEffect, Transition } from 'vue';
import { RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';
import { NConfigProvider, darkTheme } from 'naive-ui';
import { computedEager } from '@vueuse/core';
import { useIpcRendererOn } from '@vueuse/electron';
import { arrayIncludes } from '@tb-dev/ts-guard';
import { routeNames, router } from '$panel/router/router';
import { useAresStore } from '$vue/stores/ares';
import { usePanelStore } from '$panel/stores/panel';

const aresStore = useAresStore();
const panelStore = usePanelStore();

const { isVisible } = storeToRefs(panelStore);
const wrapper = computedEager(() => isVisible.value ? Transition : 'div', { flush: 'sync' });

useIpcRendererOn('panel-visibility-did-change', (_e, status: boolean) => {
    isVisible.value = status;
});

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
                <component :is="wrapper" name="tb-fade" mode="out-in">
                    <Suspense>
                        <component :is="Component" />
                        <template #fallback>
                            <span class="to-center bold-green">Carregando...</span>
                        </template>
                    </Suspense>
                </component>
            </template>
        </RouterView>
    </NConfigProvider>
</template>