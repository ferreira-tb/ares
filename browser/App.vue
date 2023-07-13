<script setup lang="ts">
import { ref } from 'vue';
import TheIpcTribalTag from '$browser/components/TheIpcTribalTag.vue';
import TheCaptchaObserver from '$browser/components/TheCaptchaObserver.vue';
import TheIncomingsObserver from '$browser/components/TheIncomingsObserver.vue';

const isIpcTribalReady = ref(false);
</script>

<template>
    <Suspense>
        <TheIpcTribalTag v-model:ready="isIpcTribalReady" />
    </Suspense>
    
    <TheCaptchaObserver />
    
    <template v-if="isIpcTribalReady">
        <Suspense>
            <TheIncomingsObserver />
        </Suspense>
    </template>
</template>