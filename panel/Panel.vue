<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { arrayIncludes } from '@tb-dev/ts-guard';
import { NConfigProvider, darkTheme } from 'naive-ui';
import { routeNames, router } from '$panel/router/router';
import { useAresStore } from '$vue/stores/ares';

const aresStore = useAresStore();

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
    </NConfigProvider>
</template>