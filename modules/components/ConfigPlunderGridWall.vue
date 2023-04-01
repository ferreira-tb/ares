<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDivider, NGrid, NGridItem, NButton, NButtonGroup, useDialog, useMessage } from 'naive-ui';
import { assertUserAlias, isDistance } from '$global/utils/guards';
import { ipcInvoke, ipcSend } from '$global/ipc';
import { ModuleConfigError } from '$modules/error';
import WallInput from '$global/components/input/WallInput.vue';
import NumberImput from '$global/components/input/NumberInput.vue';
import LabelPopover from '$global/components/popover/LabelPopover.vue';
import type { PlunderConfigType } from '$types/plunder';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(event: 'update:config', name: T, value: PlunderConfigType[T]): void;
}>();

const dialog = useDialog();
const message = useMessage();

const wallLevelToIgnore = ref<number>(props.config.wallLevelToIgnore);
const wallLevelToDestroy = ref<number>(props.config.wallLevelToDestroy);
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
                const result = await ipcInvoke('destroy-demolition-troops-config', userAlias);
                if (result !== true) throw result;
                message.success('Resetado com sucesso!');

            } catch (err) {
                ModuleConfigError.catch(err);
                message.error('Ocorreu algum erro :(');
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
                    <template #trigger>Ignorar muralhas a partir de</template>
                    <span>Determina a partir de qual nível de muralha o Ares deve ignorar aldeias.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <WallInput v-model:value="wallLevelToIgnore" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Demolir muralhas a partir de</template>
                    <span>O Ares não demolirá muralhas cujo nível seja menor que o indicado.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <WallInput v-model:value="wallLevelToDestroy" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Distância máxima para demolição</template>
                    <span>O Ares não demolirá muralhas de aldeias cuja distância (em campos) é maior do que a
                        indicada.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="destroyWallMaxDistance" :min="1" :max="9999" :step="1"
                    :validator="(v) => isDistance(v)" />
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
                    <NButton @click="ipcSend('open-demolition-troops-config-window')">Configurar</NButton>
                    <NButton @click="resetDemolitionConfig">Resetar</NButton>
                </NButtonGroup>
            </NGridItem>
        </NGrid>
    </div>
</template>

<style scoped>

</style>