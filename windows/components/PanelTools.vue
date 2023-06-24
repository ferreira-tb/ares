<script setup lang="ts">
import { NGrid, NGridItem, NLayout, NList } from 'naive-ui';
import { ipcSend } from '$renderer/ipc';
import { StandardWindowName } from '$common/enum';
import ResultGuest from '$renderer/components/ResultGuest.vue';
import PanelToolsListItem from '$windows/components/PanelToolsListItem.vue';

defineProps<{
    userAlias: UserAlias | null;
}>();
</script>

<template>
	<NLayout id="panel-tools" position="absolute">
        <div v-if="userAlias" id="panel-tools-content">
            <NGrid :cols="2" :x-gap="12">
                <NGridItem>
                    <NList>
                        <PanelToolsListItem
                            title="Contador de tropas"
                            button-text="Contar"
                            @click="ipcSend('window:open', StandardWindowName.TroopsCounter)"
                        >
                            Calcula a quantidade de tropas nas aldeias
                        </PanelToolsListItem>
                    </NList>
                </NGridItem>

                <NGridItem>
                    <NList>
                        <PanelToolsListItem
                            title="Modelos de grupo"
                            button-text="Criar grupo"
                            @click="ipcSend('window:open', StandardWindowName.GroupTemplate)"
                        >
                            Cria grupos a partir de modelos pré-definidos
                        </PanelToolsListItem>
                    </NList>
                </NGridItem>
            </NGrid>
        </div>

        <ResultGuest
            v-else
            description="É necessário estar logado para utilizar o painel."
            to-center
        />
    </NLayout>
</template>

<style scoped lang="scss">
#panel-tools-content {
    padding: 1em;
}
</style>