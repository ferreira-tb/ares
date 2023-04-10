<script setup lang="ts">
import { toRaw } from 'vue';
import { NCard, NSpace, useDialog, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { ModuleError } from '$modules/error';
import ArcherIcon from '$icons/units/ArcherIcon.vue';
import AxeIcon from '$icons/units/AxeIcon.vue';
import HeavyIcon from '$icons/units/HeavyIcon.vue';
import LightIcon from '$icons/units/LightIcon.vue';
import MarcherIcon from '$icons/units/MarcherIcon.vue';
import SpearIcon from '$icons/units/SpearIcon.vue';
import SpyIcon from '$icons/units/SpyIcon.vue';
import SwordIcon from '$icons/units/SwordIcon.vue';
import type { CustomPlunderTemplateType } from '$types/plunder';

const props = defineProps<{
    template: CustomPlunderTemplateType;
}>();

const emit = defineEmits<{
    (e: 'template-destroyed', template: CustomPlunderTemplateType): void;
}>();

const dialog = useDialog();
const message = useMessage();

function destroyTemplate() {
    const status = dialog.warning({
        title: 'Tem certeza que deseja excluir?',
        content: 'Essa ação é irreversível!',
        positiveText: 'Sim',
        negativeText: 'Cancelar',
        transformOrigin: 'center',
        onPositiveClick: async () => {
            status.loading = true;
            try {
                const rawTemplate = toRaw(props.template);
                const destroyed = await ipcInvoke('plunder:destroy-custom-template', rawTemplate);
                if (destroyed) {
                    emit('template-destroyed', rawTemplate);
                    message.success('O modelo foi excluído');
                } else {
                    message.error('Ocorreu algum erro :(');
                };

            } catch (err) {
                ModuleError.catch(err);
            };
        }
    });
};
</script>

<template>
    <NCard
        class="template-card"
        :title="template.type"
        closable
        hoverable
        bordered
        @close="destroyTemplate"
    >
        <NSpace>
            <span v-if="template.units.spear > 0">
                <SpearIcon />{{ template.units.spear.toLocaleString('pt-br') }}
            </span>
            <span v-if="template.units.sword > 0">
                <SwordIcon />{{ template.units.sword.toLocaleString('pt-br') }}
            </span>
            <span v-if="template.units.axe > 0">
                <AxeIcon />{{ template.units.axe.toLocaleString('pt-br') }}
            </span>
            <span v-if="template.units.archer > 0">
                <ArcherIcon />{{ template.units.archer.toLocaleString('pt-br') }}
            </span>
            <span v-if="template.units.spy > 0">
                <SpyIcon />{{ template.units.spy.toLocaleString('pt-br') }}
            </span>
            <span v-if="template.units.light > 0">
                <LightIcon />{{ template.units.light.toLocaleString('pt-br') }}
            </span>
            <span v-if="template.units.marcher > 0">
                <MarcherIcon />{{ template.units.marcher.toLocaleString('pt-br') }}
            </span>
            <span v-if="template.units.heavy > 0">
                <HeavyIcon />{{ template.units.heavy.toLocaleString('pt-br') }}
            </span>
        </NSpace>
    </NCard>
</template>

<style scoped>
.template-card {
    height: 150px;
}
</style>