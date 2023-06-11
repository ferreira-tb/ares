<script setup lang="ts">
import { useFetch } from '@vueuse/core';

type DownloadUrl = {
    readonly download: string;
};

defineProps<{
    readonly textContent: string;
}>();

const { data } = useFetch('https://tb.dev.br/ares/latest.json').json<DownloadUrl>();
</script>

<template>
    <a v-if="data" :href=data.download>{{ textContent }}</a>
    <span v-else>{{ textContent }}</span>
</template>