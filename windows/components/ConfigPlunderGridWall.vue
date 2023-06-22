<script setup lang="ts">
import { NButton, NButtonGroup, NDivider, NGrid, NGridItem, NInputNumber, useDialog, useMessage } from 'naive-ui';
import { usePlunderConfigStore } from '$renderer/stores';
import { assertUserAlias } from '$common/guards';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { RendererProcessError } from '$renderer/error';
import { formatFields, parseFields, formatWallLevel, parseWallLevel } from '$renderer/utils/format-input';

const props = defineProps<{
    userAlias: UserAlias | null;
}>();

const dialog = useDialog();
const message = useMessage();

const config = usePlunderConfigStore();

function resetDemolitionConfig() {
    const status = dialog.warning({
        title: 'Tem certeza?',
        content: 'Essa ação é irreversível!',
        positiveText: 'Sim',
        negativeText: 'Cancelar',
        onPositiveClick: async () => {
            status.loading = true;
            try {
                assertUserAlias(props.userAlias, RendererProcessError);
                const destroyed = await ipcInvoke('plunder:destroy-demolition-config', props.userAlias);
                if (destroyed) {
                    message.success('Resetado com sucesso!');
                } else {
                    message.error('Ocorreu algum erro :(');
                };
                
            } catch (err) {
                RendererProcessError.catch(err);
            };
        }
    });
};
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Muralha</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-label">Ignorar a partir de</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.wallLevelToIgnore"
                    class="config-input"
                    :min="1"
                    :max="20"
                    :step="1"
                    :validator="(v) => Number.isInteger(v) && (v >= 1 && v <= 20)"
                    :format="formatWallLevel"
                    :parse="parseWallLevel"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Demolir a partir de</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.wallLevelToDestroy"
                    class="config-input"
                    :min="1"
                    :max="20"
                    :step="1"
                    :validator="(v) => Number.isInteger(v) && (v >= 1 && v <= 20)"
                    :format="formatWallLevel"
                    :parse="parseWallLevel"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Distância máxima de demolição</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.destroyWallMaxDistance"
                    class="config-input"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => Number.isFinite(v) && v >= 1"
                    :format="formatFields"
                    :parse="parseFields"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Tropas de demolição</div>
            </NGridItem>
            <NGridItem>
                <NButtonGroup>
                    <NButton @click="ipcSend('plunder:open-demolition-config-window')">Configurar</NButton>
                    <NButton @click="resetDemolitionConfig">Resetar</NButton>
                </NButtonGroup>
            </NGridItem>
        </NGrid>
    </div>
</template>