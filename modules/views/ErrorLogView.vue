<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import { NTabs, NTab } from 'naive-ui';
import { router } from '$modules/router/router';
import type { ErrorModuleRoutes } from '$types/modules';

const route = ref<ErrorModuleRoutes>('error-general');
watchEffect(() => router.push({ name: route.value }));
</script>

<template>
    <nav class="module-nav-bar">
        <NTabs animated defaultValue="error-general" v-model:value="route" justifyContent="start" tab-style="margin-right: 2em;">
            <NTab name="error-general" tab="Geral"></NTab>
            <NTab name="error-electron" tab="Electron"></NTab>
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

<style scoped>
:deep(.error-log) {
    margin-bottom: 0.5em;
    user-select: text;
}

:deep(.error-log:last-of-type) {
    margin-bottom: 1em;
}
</style>