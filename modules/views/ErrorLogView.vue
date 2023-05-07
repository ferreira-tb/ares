<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { useElementSize, useWindowSize } from '@vueuse/core';
import { NTabs, NTab } from 'naive-ui';
import { router } from '$modules/router';
import { ModuleRouterError } from '$modules/error';
import type { ErrorModuleRoutes } from '$types/modules';
import ButtonErrorExport from '$renderer/components/ButtonErrorExport.vue';

const { height: windowHeight } = useWindowSize();

const navBar = ref<HTMLElement | null>(null);
const { height: navBarHeight } = useElementSize(navBar);

const exportButton = ref<HTMLElement | null>(null);
const { height: exportButtonHeight } = useElementSize(exportButton);

const contentHeight = computed(() => windowHeight.value - navBarHeight.value);
const wrapperBottom = computed(() => `${contentHeight.value - 30}px`);
const wrapperHeight = computed(() => `${contentHeight.value - exportButtonHeight.value}px`);

const route = ref<ErrorModuleRoutes>('error-general');
watchEffect(() => {
    router.push({ name: route.value }).catch(ModuleRouterError.catch);
});
</script>

<template>
    <nav ref="navBar" class="module-nav-bar">
        <NTabs v-model:value="route" animated default-value="error-general" justify-content="start" tab-style="margin-right: 2em;">
            <NTab name="error-general" tab="Geral" />
            <NTab name="error-electron" tab="Electron" />
        </NTabs>
    </nav>

    <div class="module-tabbed-view-wrapper">
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

    <ButtonErrorExport ref="exportButton" :button-top="wrapperBottom" />
</template>

<style scoped lang="scss">
@use '$modules/assets/main.scss';

.module-tabbed-view-wrapper {
    @include main.module-tabbed-view-wrapper($margin-bottom: 2rem);
    bottom: v-bind("wrapperBottom");
    height: v-bind("wrapperHeight");
}
</style>