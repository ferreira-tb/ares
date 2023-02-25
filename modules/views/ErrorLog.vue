<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { NTabs, NTab } from 'naive-ui';
import { router } from '$modules/router/router.js';
import type { ErrorModuleRoutes } from '$types/modules.js';

const route = ref<ErrorModuleRoutes>('normal-errors');
watchEffect(() => router.push({ name: route.value }));
</script>

<template>
    <nav class="module-nav-bar">
        <NTabs animated defaultValue="normal-errors" v-model:value="route" justifyContent="start" tab-style="margin-right: 2em;">
            <NTab name="normal-errors" tab="Geral"></NTab>
            <NTab name="dom-errors" tab="DOM"></NTab>
            <NTab name="main-process-errors" tab="Núcleo"></NTab>
        </NTabs>
    </nav>

    <div class="module-content">
        <RouterView class="module-view scrollbar" v-slot="{ Component }">
            <template v-if="Component">
                <Transition name="fade" mode="out-in">
                    <KeepAlive>
                        <Suspense>
                            <component :is="Component" />
                            <template #fallback>
                                <span class="loading-text">Carregando...</span>
                            </template>
                        </Suspense>
                    </KeepAlive>
                </Transition>
            </template>
        </RouterView>
    </div>
</template>