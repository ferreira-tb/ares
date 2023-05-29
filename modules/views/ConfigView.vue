<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { RouterView } from 'vue-router';
import { syncRef, useArrayIncludes, useElementSize, useWindowSize } from '@vueuse/core';
import { NTabs, NTab, type TabsInst } from 'naive-ui';
import { configRouteNames, router } from '$modules/router';

const tabs = ref<TabsInst | null>(null);
const tabName = ref<ConfigModuleRoutes>('config-general');
watch(tabName, (name) => router.push({ name }));

const navBar = ref<HTMLElement | null>(null);
const { height: navBarHeight } = useElementSize(navBar, { width: 0, height: 0 }, { box: 'border-box' });

const { height: windowHeight } = useWindowSize();
const viewHeight = computed(() => `${windowHeight.value - navBarHeight.value}px`);

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
    <nav ref="navBar" class="config-nav-bar">
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

    <div class="config-view-wrapper tb-scrollbar">
        <RouterView #default="{ Component }">
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

<style scoped lang="scss">
.config-nav-bar {
    height: 30px;
    padding-left: 0.5em;
    padding-right: 0.5em;
    user-select: none;
}

.config-view-wrapper {
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 100%;
    height: v-bind("viewHeight");
    overflow-x: hidden;
    overflow-y: auto;
    user-select: none;
    padding-left: 0.3em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
}
</style>