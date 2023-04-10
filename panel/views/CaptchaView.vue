<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { NResult } from 'naive-ui';
import { watchImmediate } from '@vueuse/core';
import { useAresStore } from '$renderer/stores/ares';
import { usePlunderConfigStore } from '$renderer/stores/plunder';
import { togglePlunder } from '$panel/utils/helpers';

const aresStore = useAresStore();
const plunderConfigStore = usePlunderConfigStore();

const { captcha } = storeToRefs(aresStore);

watch(() => plunderConfigStore.active, togglePlunder);

watchImmediate(captcha, () => {
    plunderConfigStore.active = false;
});
</script>

<template>
    <main>
        <NResult
            status="warning"
            size="small"
            title="Há um captcha ativo!"
            description="Não será possível usar o Ares até que ele seja removido."
        />
    </main>
</template>

<style scoped>
main {
    margin-top: 1.5rem;
}
</style>