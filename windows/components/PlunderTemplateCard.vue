<script setup lang="ts">
import { toRaw } from 'vue';
import { NCard, NSpace, useDialog, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { RendererProcessError } from '$renderer/error';
import ArcherIcon18 from '$icons/units/ArcherIcon18.vue';
import AxeIcon18 from '$icons/units/AxeIcon18.vue';
import HeavyIcon18 from '$icons/units/HeavyIcon18.vue';
import LightIcon18 from '$icons/units/LightIcon18.vue';
import MarcherIcon18 from '$icons/units/MarcherIcon18.vue';
import SpearIcon18 from '$icons/units/SpearIcon18.vue';
import SpyIcon18 from '$icons/units/SpyIcon18.vue';
import SwordIcon18 from '$icons/units/SwordIcon18.vue';

const props = defineProps<{
    locale: string;
    template: PlunderCustomTemplateType;
}>();

const emit = defineEmits<{
    (e: 'template-destroyed', template: PlunderCustomTemplateType): void;
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
                }

            } catch (err) {
                RendererProcessError.catch(err);
            }
        }
    });
}
</script>

<template>
    <NCard
        class="template-card"
        :title="template.name"
        closable
        hoverable
        bordered
        @close="destroyTemplate"
    >
        <NSpace>
            <span v-if="template.units.spear > 0">
                <SpearIcon18 />{{ template.units.spear.toLocaleString(locale) }}
            </span>
            <span v-if="template.units.sword > 0">
                <SwordIcon18 />{{ template.units.sword.toLocaleString(locale) }}
            </span>
            <span v-if="template.units.axe > 0">
                <AxeIcon18 />{{ template.units.axe.toLocaleString(locale) }}
            </span>
            <span v-if="template.units.archer > 0">
                <ArcherIcon18 />{{ template.units.archer.toLocaleString(locale) }}
            </span>
            <span v-if="template.units.spy > 0">
                <SpyIcon18 />{{ template.units.spy.toLocaleString(locale) }}
            </span>
            <span v-if="template.units.light > 0">
                <LightIcon18 />{{ template.units.light.toLocaleString(locale) }}
            </span>
            <span v-if="template.units.marcher > 0">
                <MarcherIcon18 />{{ template.units.marcher.toLocaleString(locale) }}
            </span>
            <span v-if="template.units.heavy > 0">
                <HeavyIcon18 />{{ template.units.heavy.toLocaleString(locale) }}
            </span>
        </NSpace>
    </NCard>
</template>

<style scoped lang="scss">
.template-card {
    height: 150px;
}
</style>