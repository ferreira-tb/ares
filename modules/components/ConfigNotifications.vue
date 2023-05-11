<script setup lang="ts">
import { reactive, watch, toRaw } from 'vue';
import { NDivider, NGrid, NGridItem } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import SwitchPopover from '$renderer/components/SwitchPopover.vue';

const previous = await ipcInvoke('get-app-notifications-config');
const config = reactive(previous);
watch(config, () => ipcSend('update-app-notifications-config', toRaw(config)));
</script>

<template>
    <section class="notifications-config">
        <NDivider class="config-divider" title-placement="left">Geral</NDivider>
        <NGrid class="switch-area" :cols="1" :y-gap="10">
            <NGridItem>
                <SwitchPopover v-model:value="config.notifyOnError" size="medium">
                    <template #trigger>Notificar ao encontrar erros</template>
                    <span>
                        Essa opção estará habilitada por padrão em versões do tipo alpha.
                    </span>
                </SwitchPopover>
            </NGridItem>
        </NGrid>
    </section>
</template>

<style scoped lang="scss">
.notifications-config {
    padding: 0.5em;
}
</style>