<script setup lang="ts">
import { NDivider, NGrid, NGridItem, NButton, useDialog, useMessage } from 'naive-ui';
import { ipcInvoke } from '$global/ipc';
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
                const dropped = await ipcInvoke('drop-database');
                if (dropped !== true) throw dropped;
                message.success('O Ares reiniciará em instantes...');
            } catch (err) {
                ModuleConfigError.catch(err);
                message.error('Ocorreu algum erro :(');
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
                <div class="flex-center-y"><span>Excluir banco de dados</span></div>
            </NGridItem>
            <NGridItem>
                <NButton @click="dropDatabase">Excluir</NButton>
            </NGridItem>
        </NGrid>
    </section>
</template>

<style scoped lang="scss">
@use '$modules/assets/main.scss';

.advanced-config {
    padding: 0.5em;

    .flex-center-y {
        @include main.flex-center-y;
    }
}
</style>