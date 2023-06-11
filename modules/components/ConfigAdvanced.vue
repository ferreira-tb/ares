<script setup lang="ts">
import { NDivider, NGrid, NGridItem, NButton, useDialog, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { ModuleConfigError } from '$modules/error';

const dialog = useDialog();
const message = useMessage();

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
                };
                
            } catch (err) {
                ModuleConfigError.catch(err);
            };
        }
    });
};
</script>

<template>
    <section class="advanced-config">
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
.advanced-config {
    padding: 0.5em;
}
</style>