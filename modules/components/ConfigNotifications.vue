<script setup lang="ts">
import { reactive, watch, toRaw } from 'vue';
import { NDivider, NGrid, NGridItem } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$global/ipc';
import SwitchPopover from '$global/components/SwitchPopover.vue';

const previous = await ipcInvoke('get-app-notifications-config');
const config = reactive(previous);
watch(config, () => ipcSend('update-app-notifications-config', toRaw(config)));
</script>

<template>
    <section class="notifications-config">
        <NDivider title-placement="left" class="config-divider">Geral</NDivider>
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

<style scoped>
.notifications-config {
    padding: 0.5em;
}
</style>