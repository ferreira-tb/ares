<script setup lang="ts">
import { RouterView } from 'vue-router';
import { VTabs as Tabs, VTab as Tab } from 'vuetify/components/VTabs';
import type { ModuleRouteToPush } from '$types/modules.js';
</script>

<template>
    <nav>
        <Tabs height="30px" :mandatory="true">
            <Tab :to="({ name: 'general-config' } satisfies ModuleRouteToPush)">Geral</Tab>
            <Tab :to="({ name: 'plunder-config' } satisfies ModuleRouteToPush)">Saque</Tab>
        </Tabs>
    </nav>

    <div class="config-content">
        <RouterView class="config-view scrollbar" v-slot="{ Component }">
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

<style scoped>
.config-content {
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 100%;
    padding-left: 0.3em;
    padding-right: 0.3em;
    margin-top: 0.5em;
    overflow: hidden;
}

:deep(.config-view) {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>