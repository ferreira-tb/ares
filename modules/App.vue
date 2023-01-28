<script setup lang="ts">
import { RouterView } from 'vue-router';

</script>

<template>
    <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
            <Suspense>
                <component :is="Component" :key="route.path" />
                <template #fallback class="to-center green-text bold">
                    Carregando...
                </template>
            </Suspense>
        </Transition>
    </RouterView>
</template>