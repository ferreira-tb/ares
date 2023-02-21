<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView } from 'vue-router';
import { NTabs, NTab } from 'naive-ui';
import { arrayIncludes } from '@tb-dev/ts-guard';
import { configRoutes, router } from '$modules/router/router.js';
import type { ConfigModuleRoutes } from '$types/modules.js';

const route = ref<ConfigModuleRoutes>('general-config');
if (arrayIncludes(configRoutes, router.currentRoute.value)) route.value = router.currentRoute.value;
watch(route, () => router.push({ name: route.value }));
</script>

<template>
    <nav class="module-nav-bar">
        <NTabs animated defaultValue="general-config" v-model:value="route" justifyContent="start" tab-style="margin-right: 2em;">
            <NTab name="general-config" tab="Geral">Geral</NTab>
            <NTab name="plunder-config" tab="Saque">Saque</NTab>
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
                                <span class="to-center green-text bold">Carregando...</span>
                            </template>
                        </Suspense>
                    </KeepAlive>
                </Transition>
            </template>
        </RouterView>
    </div>
</template>