<script setup lang="ts">
import { reactive, watch, toRaw } from 'vue';
import { NGrid, NGridItem } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$global/ipc';
import SwitchPopover from '$global/components/popover/SwitchPopover.vue';

const previous = await ipcInvoke('get-app-general-config');
const config = reactive(previous);
watch(config, () => ipcSend('update-app-general-config', toRaw(config)));
</script>

<template>
    <section class="general-config">
        <NGrid class="switch-area" :cols="1" :y-gap="10">
            <NGridItem>
                <SwitchPopover v-model:value="config.reloadAfterCaptcha" size="medium">
                    <template #trigger>Atualizar página após remoção de captcha</template>
                    <span>
                        Um coisa ou outra pode não funcionar corretamente após a remoção de um captcha.
                        Sendo assim, o Ares atualiza a página para garantir que tudo funcione como deveria.
                        É recomendado que essa opção permaneça ativada.
                    </span>
                </SwitchPopover>
            </NGridItem>
        </NGrid>
    </section>
</template>

<style scoped>
.general-config {
    padding-top: 0.5em;
    padding-bottom: 2em;
}
</style>