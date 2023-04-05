<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { NTabs, NTab } from 'naive-ui';
import { router } from '$modules/router';
import { ModuleRouterError } from '$modules/error';
import type { ErrorModuleRoutes } from '$types/modules';

const route = ref<ErrorModuleRoutes>('error-general');
watchEffect(() => {
    router.push({ name: route.value }).catch(ModuleRouterError.catch);
});
</script>

<template>
    <nav class="module-nav-bar">
        <NTabs v-model:value="route" animated default-value="error-general" justify-content="start" tab-style="margin-right: 2em;">
            <NTab name="error-general" tab="Geral" />
            <NTab name="error-electron" tab="Electron" />
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
:deep(.error-log) {
    margin-bottom: 0.5em;
    user-select: text;
}

:deep(.error-log:last-of-type) {
    margin-bottom: 1em;
}
</style>