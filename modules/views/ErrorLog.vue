<script setup lang="ts">
import { RouterView } from 'vue-router';
import { VTabs as Tabs, VTab as Tab } from 'vuetify/components/VTabs';
import { router } from '$modules/router/router.js';

router.push({ name: 'normal-errors' });
</script>

<template>
    <nav>
        <Tabs height="30px" :mandatory="true">
            <Tab :to="({ name: 'normal-errors' })">Geral</Tab>
            <Tab :to="({ name: 'dom-errors' })">DOM</Tab>
        </Tabs>
    </nav>

    <div class="error-log-content">
        <RouterView class="error-log-view scrollbar" v-slot="{ Component }">
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
.error-log-content {
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 100%;
    padding-left: 0.3em;
    padding-right: 0.3em;
    margin-top: 0.5em;
    overflow: hidden;
}

:deep(.error-log-view) {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>