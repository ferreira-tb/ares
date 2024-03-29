<script setup lang="ts">
import { reactive, toRaw, toRef, watch } from 'vue';
import { watchDeep } from '@vueuse/core';
import { NCheckbox, NDivider, NGrid, NGridItem, NButton, useDialog, useMessage } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { RendererProcessError } from '$renderer/error';

const dialog = useDialog();
const message = useMessage();

const config = reactive(await ipcInvoke('config:get', 'advanced'));
watchDeep(config, (newValue) => ipcSend('config:update', 'advanced', toRaw(newValue)));

const isDebugModeEnabled = toRef(config, 'debug');
watch(isDebugModeEnabled, (newValue) => ipcSend('debug:toggle', newValue));

function dropDatabase() {
    const status = dialog.warning({
        title: 'Tem certeza?',
        content: 'Todos os dados serão perdidos para sempre.',
        positiveText: 'Eu sei o que estou fazendo',
        negativeText: 'Cancelar',
        onPositiveClick: async () => {
            status.loading = true;
            try {
                const cleared = await ipcInvoke('db:clear-database');
                if (cleared) {
                    message.success('O Ares reiniciará em instantes...');
                } else {
                    message.error('Ocorreu algum erro :(');
                }
                
            } catch (err) {
                RendererProcessError.catch(err);
            }
        }
    });
}
</script>

<template>
    <section id="advanced-config">
        <NDivider title-placement="left" class="config-divider">Desenvolvedor</NDivider>
        <NGrid :cols="1" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-checkbox">
                    <NCheckbox v-model:checked="config.devTools" size="large">
                        Habilitar DevTools
                    </NCheckbox>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-checkbox">
                    <NCheckbox v-model:checked="config.debug" size="large">
                        Habilitar modo de depuração
                    </NCheckbox>
                </div>
            </NGridItem>
        </NGrid>

        <NDivider title-placement="left" class="config-divider">Banco de dados</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-label">Excluir banco de dados</div>
            </NGridItem>
            <NGridItem>
                <NButton @click="dropDatabase">Excluir</NButton>
            </NGridItem>
        </NGrid>
    </section>
</template>

<style scoped lang="scss">
#advanced-config {
    padding: 0.5em;
}
</style>