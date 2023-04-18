<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { syncRef, useArrayIncludes } from '@vueuse/core';
import { NTabs, NTab, type TabsInst } from 'naive-ui';
import { configRouteNames, router } from '$modules/router';
import type { ConfigModuleRoutes } from '$types/modules';

const tabs = ref<TabsInst | null>(null);
const tabName = ref<ConfigModuleRoutes>('config-general');
watch(tabName, (name) => router.push({ name }));

const currentRouteName = ref<string | null>(null);
syncRef(router.currentRoute, currentRouteName, {
    deep: true,
    direction: 'ltr',
    immediate: true,
    transform: {
        ltr: (route) => route.name
    }
});

const isConfigRoute = useArrayIncludes(configRouteNames, currentRouteName);
onMounted(async () => {
    // Se uma rota já tiver sido direcionada, atualiza o tabName.
    if (isConfigRoute.value) {
        tabName.value = currentRouteName.value as ConfigModuleRoutes;
        await nextTick();
        tabs.value?.syncBarPosition();
    };
});
</script>

<template>
    <nav class="module-nav-bar">
        <NTabs
            ref="tabs"
            v-model:value="tabName"
            default-value="config-general"
            justify-content="start"
            tab-style="margin-right: 2em;"
            animated
        >
            <NTab name="config-general" tab="Geral" />
            <NTab name="config-plunder" tab="Saque" />
            <NTab name="config-notifications" tab="Notificações" />
            <NTab name="config-advanced" tab="Avançado" />
        </NTabs>
    </nav>

    <div class="module-content">
        <RouterView #default="{ Component }" class="module-view tb-scrollbar">
            <template v-if="Component">
                <Transition name="tb-fade" mode="out-in">
                    <KeepAlive>
                        <Suspense>
                            <component :is="Component" />
                            <template #fallback>
                                <span class="bold-green to-center">Carregando...</span>
                            </template>
                        </Suspense>
                    </KeepAlive>
                </Transition>
            </template>
        </RouterView>
    </div>
</template>

<style scoped>
:deep(.config-divider) {
    margin-top: 1em !important;
    margin-bottom: 0.5em !important;
}

:deep(.config-divider:first-of-type) {
    margin-top: 0.3em !important;
}
</style>