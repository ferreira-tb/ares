<script setup lang="ts">
import { reactive, watch, toRaw } from 'vue';
import { NCheckbox, NDivider, NGrid, NGridItem } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';

const previous = await ipcInvoke('config:notifications');
const config = reactive(previous);
watch(config, () => ipcSend('config:update', 'notifications', toRaw(config)));
</script>

<template>
    <section class="notifications-config">
        <NDivider class="config-divider" title-placement="left">Geral</NDivider>
        <NGrid class="switch-area" :cols="1" :y-gap="10">
            <NGridItem>
                <NCheckbox v-model:checked="config.notifyOnError" size="large">
                    Notificar ao encontrar erros
                </NCheckbox>
            </NGridItem>
        </NGrid>
    </section>
</template>

<style scoped lang="scss">
.notifications-config {
    padding: 0.5em;
}
</style>