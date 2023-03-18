<script setup lang="ts">
import { watchEffect } from 'vue';
import { NResult } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { usePlunderConfigStore } from '$vue/stores/plunder';
import { useAresStore } from '$vue/stores/ares';
import { pushRoute } from '$panel/utils/helpers';

const aresStore = useAresStore();
const plunderConfigStore = usePlunderConfigStore();

const { captcha, screen: screenName } = storeToRefs(aresStore);
captcha.value = true;

watchEffect(() => {
    if (captcha.value === true) {
        plunderConfigStore.active = false;
    } else {
        pushRoute(screenName.value);
    };
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