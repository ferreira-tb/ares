<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NConfigProvider, darkTheme } from 'naive-ui';
</script>

<template>
    <NConfigProvider :theme="darkTheme">
        <RouterView v-slot="{ Component }">
            <template v-if="Component">
                <Transition name="fade" mode="out-in">
                    <Suspense>
                        <component :is="Component" />
                        <template #fallback>
                            <span class="loading-text">Carregando...</span>
                        </template>
                    </Suspense>
                </Transition>
            </template>
        </RouterView>
    </NConfigProvider>
</template>