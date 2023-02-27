<script setup lang="ts">
import { toRaw } from 'vue';
import { NCard, NSpace, useDialog, useMessage } from 'naive-ui';
import { ipcInvoke } from '$global/ipc.js';
import { ModuleError } from '$modules/error.js';
import ArcherIcon from '$vue/components/icons/units/ArcherIcon.vue';
import AxeIcon from '$vue/components/icons/units/AxeIcon.vue';
import HeavyIcon from '$vue/components/icons/units/HeavyIcon.vue';
import LightIcon from '$vue/components/icons/units/LightIcon.vue';
import MarcherIcon from '$vue/components/icons/units/MarcherIcon.vue';
import SpearIcon from '$vue/components/icons/units/SpearIcon.vue';
import SpyIcon from '$vue/components/icons/units/SpyIcon.vue';
import SwordIcon from '$vue/components/icons/units/SwordIcon.vue';
import type { CustomPlunderTemplateType } from '$types/plunder.js';

const dialog = useDialog();
const message = useMessage();

const props = defineProps<{
    template: CustomPlunderTemplateType;
}>();

const emit = defineEmits<{
    (event: 'template-destroyed', template: CustomPlunderTemplateType): void;
}>();

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
                const destroyed = await ipcInvoke('destroy-custom-plunder-template', rawTemplate);
                if (destroyed !== true) throw destroyed;
                emit('template-destroyed', rawTemplate);
                message.success('O modelo foi excluído');

            } catch (err) {
                ModuleError.catch(err);
                message.error('Ocorreu algum erro :(');
            };
        }
    });
};
</script>

<template>
    <NCard :title="template.type" closable hoverable bordered class="template-card" @close="destroyTemplate">
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