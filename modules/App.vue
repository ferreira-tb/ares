<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Transition name="fade" mode="out-in">
                <Suspense>
                    <component :is="Component" />
                    <template #fallback>
                        <span class="to-center green-text bold">Carregando...</span>
                    </template>
                </Suspense>
            </Transition>
        </template>
    </RouterView>
</template>

<style scoped>
:global(html) {
    overflow: hidden;
}
</style>