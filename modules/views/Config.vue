<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { NTabs, NTab, type TabsInst } from 'naive-ui';
import { arrayIncludes } from '@tb-dev/ts-guard';
import { configRouteNames, router } from '$modules/router/router.js';
import type { ConfigModuleRoutes } from '$types/modules.js';

const tabs = ref<TabsInst | null>(null);
const tabName = ref<ConfigModuleRoutes>('general-config');
watch(tabName, () => router.push({ name: tabName.value }));

onMounted(async () => {
    // Se uma rota já tiver sido direcionada, atualiza o tabName.
    if (arrayIncludes(configRouteNames, router.currentRoute.value.name)) {
        tabName.value = router.currentRoute.value.name;
        await nextTick();
        tabs.value?.syncBarPosition();
    };
});
</script>

<template>
    <nav class="module-nav-bar">
        <NTabs ref="tabs" animated defaultValue="general-config" v-model:value="tabName" justifyContent="start" tab-style="margin-right: 2em;">
            <NTab name="general-config" tab="Geral">Geral</NTab>
            <NTab name="plunder-config" tab="Saque">Saque</NTab>
        </NTabs>
    </nav>

    <div class="module-content">
        <RouterView class="module-view tb-scrollbar" v-slot="{ Component }">
            <template v-if="Component">
                <Transition name="tb-fade" mode="out-in">
                    <KeepAlive>
                        <Suspense>
                            <component :is="Component" />
                            <template #fallback>
                                <span class="to-center bold-green">Carregando...</span>
                            </template>
                        </Suspense>
                    </KeepAlive>
                </Transition>
            </template>
        </RouterView>
    </div>
</template>