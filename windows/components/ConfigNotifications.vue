<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { watchDeep } from '@vueuse/core';
import { NCheckbox, NDivider, NGrid, NGridItem } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';

const config = ref(await ipcInvoke('config:notifications'));
watchDeep(config, (newValue) => ipcSend('config:update', 'notifications', toRaw(newValue)));
</script>

<template>
    <section class="notifications-config">
        <NDivider class="config-divider" title-placement="left">Notificações</NDivider>
        <NGrid class="switch-area" :cols="1" :y-gap="10">
            <NGridItem>
                <div class="config-checkbox">
                    <NCheckbox v-model:checked="config.notifyOnError" size="large">
                        Notificar ao encontrar erros
                    </NCheckbox>
                </div>
            </NGridItem>
        </NGrid>
    </section>
</template>

<style scoped lang="scss">
.notifications-config {
    padding: 0.5em;
}
</style>