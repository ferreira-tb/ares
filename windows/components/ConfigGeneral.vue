<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { watchDeep } from '@vueuse/core';
import { NCheckbox, NDivider, NGrid, NGridItem } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';

const config = ref(await ipcInvoke('config:get', 'general'));
watchDeep(config, (newValue) => ipcSend('config:update', 'general', toRaw(newValue)));
</script>

<template>
    <section class="general-config">
        <NDivider class="config-divider" title-placement="left">Captcha</NDivider>
        <NGrid class="switch-area" :cols="1" :y-gap="10">
            <NGridItem>
                <div class="config-checkbox">
                    <NCheckbox v-model:checked="config.reloadAfterCaptcha" size="large">
                        Atualizar página após remoção de captcha
                    </NCheckbox>
                </div>
            </NGridItem>
        </NGrid>
    </section>
</template>

<style scoped lang="scss">
.general-config {
    padding: 0.5em;
}
</style>