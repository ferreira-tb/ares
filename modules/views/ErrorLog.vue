<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, RouterView, type RouteRecordName } from 'vue-router';
import { router } from '$modules/router/router.js';

const currentRoute = ref<RouteRecordName | null>(null);
const normalClass = computed(() => ({ 'current-page': currentRoute.value === 'normal-errors' }));
const domClass = computed(() => ({ 'current-page': currentRoute.value === 'dom-errors' }));

watch(router.currentRoute, () => {
    const routeName = router.currentRoute.value.name
    if (routeName) currentRoute.value = routeName;
});

router.push({ name: 'normal-errors' });
</script>

<template>
    <nav class="error-log-nav-bar">
        <RouterLink :class="normalClass" :to="({ name: 'normal-errors' })">Geral</RouterLink>
        <RouterLink :class="domClass" :to="({ name: 'dom-errors' })">DOM</RouterLink>
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
.error-log-nav-bar {
    display: flex;
    justify-content: start;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    width: 100%;
    border-bottom: 1px solid var(--color-border);
    user-select: none;
}

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

.error-log-nav-bar > a:first-of-type {
    margin-left: 0.5em;
}

.error-log-nav-bar > a:not(:last-of-type) {
    margin-right: 1em;
}

.error-log-nav-bar > .current-page {
    font-weight: bold;
}
</style>