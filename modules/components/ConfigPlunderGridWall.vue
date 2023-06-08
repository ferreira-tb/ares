<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NButtonGroup, NDivider, NGrid, NGridItem, NInputNumber, useDialog, useMessage } from 'naive-ui';
import { formatFields, parseFields, formatWallLevel, parseWallLevel } from '$modules/utils/input-parser';
import { assertUserAlias } from '$common/guards';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { ModuleConfigError } from '$modules/error';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(e: 'update:config', name: T, value: PlunderConfigType[T]): void;
}>();

const dialog = useDialog();
const message = useMessage();

const wallLevelToIgnore = ref<WallLevel>(props.config.wallLevelToIgnore);
const wallLevelToDestroy = ref<WallLevel>(props.config.wallLevelToDestroy);
const destroyWallMaxDistance = ref<number>(props.config.destroyWallMaxDistance);

watch(wallLevelToIgnore, (v) => emit('update:config', 'wallLevelToIgnore', v));
watch(wallLevelToDestroy, (v) => emit('update:config', 'wallLevelToDestroy', v));
watch(destroyWallMaxDistance, (v) => emit('update:config', 'destroyWallMaxDistance', v));

function resetDemolitionConfig() {
    const status = dialog.warning({
        title: 'Tem certeza?',
        content: 'Essa ação é irreversível!',
        positiveText: 'Sim',
        negativeText: 'Cancelar',
        onPositiveClick: async () => {
            status.loading = true;
            try {
                const userAlias = await ipcInvoke('user-alias');
                assertUserAlias(userAlias, ModuleConfigError);
                const destroyed = await ipcInvoke('plunder:destroy-demolition-config', userAlias);
                if (destroyed) {
                    message.success('Resetado com sucesso!');
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
    <div>
        <NDivider title-placement="left" class="config-divider">Muralha</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-label">Ignorar a partir de</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="wallLevelToIgnore"
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
                    v-model:value="wallLevelToDestroy"
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
                    v-model:value="destroyWallMaxDistance"
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