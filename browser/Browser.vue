<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { arrayIncludes } from '@tb-dev/ts-guard';
import { routeNames, router } from '$browser/router/router.js';
import { useAresStore } from '$vue/stores/ares.js';
import { getPlunderInfo } from '$lib/plunder/info.js';
import ScriptTag from '$browser/components/ScriptTag.vue';

const aresStore = useAresStore();

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => {
    const screen = aresStore.screen;
    if (arrayIncludes(routeNames, screen)) {
        router.push({ name: screen });
    } else {
        router.push('/');
    };

    if (screen === 'am_farm') getPlunderInfo();
});
</script>

<template>
    <Suspense>
        <ScriptTag />
    </Suspense>

    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Suspense>
                <component :is="Component" />
            </Suspense>
        </template>
    </RouterView>
</template>