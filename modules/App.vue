<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NConfigProvider, NDialogProvider, NMessageProvider, darkTheme } from 'naive-ui';
</script>

<template>
    <NConfigProvider :theme="darkTheme">
        <RouterView v-slot="{ Component }">
            <NDialogProvider>
                <NMessageProvider>
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
                </NMessageProvider>
            </NDialogProvider>
        </RouterView>
    </NConfigProvider>
</template>