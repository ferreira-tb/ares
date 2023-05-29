<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDivider, NGrid, NGridItem, NButton, NButtonGroup, useDialog, useMessage } from 'naive-ui';
import { assertUserAlias, isDistance } from '$shared/guards';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { ModuleConfigError } from '$modules/error';
import InputWall from '$renderer/components/InputWall.vue';
import InputNumber from '$renderer/components/InputNumber.vue';
import LabelPopover from '$renderer/components/LabelPopover.vue';

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
                <LabelPopover>
                    <template #trigger>Ignorar a partir de</template>
                    <span>Determina a partir de qual nível de muralha o Ares deve ignorar aldeias.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputWall v-model:value="wallLevelToIgnore" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Demolir a partir de</template>
                    <span>O Ares não demolirá muralhas cujo nível seja menor que o indicado.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputWall v-model:value="wallLevelToDestroy" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Distância máxima</template>
                    <span>O Ares não demolirá muralhas de aldeias cuja distância (em campos) é maior do que a
                        indicada.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber
                    v-model:value="destroyWallMaxDistance"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => isDistance(v)"
                />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Tropas de demolição</template>
                    <span>Por padrão, o Ares envia bárbaros e aríetes para destruir as muralhas, mas você pode mudar
                        isso!</span>
                </LabelPopover>
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