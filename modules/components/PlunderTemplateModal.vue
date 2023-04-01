<script setup lang="ts">
import { computed, nextTick, reactive, ref, toRaw } from 'vue';
import { useVModels } from '@vueuse/core';
import { NModal, NForm, NFormItem, NFormItemGi, NGrid, NInput, NButton, NButtonGroup, NCheckbox } from 'naive-ui';
import { useDialog, useMessage } from 'naive-ui';
import { isString, isInteger } from '@tb-dev/ts-guard';
import { ipcInvoke } from '$global/ipc';
import { ModuleError } from '$modules/error';
import InputNumber from '$global/components/InputNumber.vue';
import ArcherIcon from '$icons/units/ArcherIcon.vue';
import AxeIcon from '$icons/units/AxeIcon.vue';
import HeavyIcon from '$icons/units/HeavyIcon.vue';
import LightIcon from '$icons/units/LightIcon.vue';
import MarcherIcon from '$icons/units/MarcherIcon.vue';
import SpearIcon from '$icons/units/SpearIcon.vue';
import SpyIcon from '$icons/units/SpyIcon.vue';
import SwordIcon from '$icons/units/SwordIcon.vue';
import type { FormRules, FormItemRule } from 'naive-ui';
import type { CustomPlunderTemplateType } from '$types/plunder';
import type { UserAlias } from '$types/electron';

const dialog = useDialog();
const message = useMessage();

interface Props {
    show: boolean;
    userAlias: UserAlias;
    isArcherWorld: boolean;
    templates: CustomPlunderTemplateType[];

    spear: number;
    sword: number;
    axe: number;
    archer: number;
    spy: number;
    light: number;
    marcher: number;
    heavy: number;
};

const props = withDefaults(defineProps<Props>(), {
    show: false,
    spear: 0,
    sword: 0,
    axe: 0,
    archer: 0,
    spy: 0,
    light: 0,
    marcher: 0,
    heavy: 0
});

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
    (e: 'update:templates', value: CustomPlunderTemplateType): void;
}>();

const { show, templates } = useVModels(props, emit);

const templateUnits: CustomPlunderTemplateType = reactive({
    type: '',
    description: null,
    alias: props.userAlias,
    units: {
        spear: props.spear,
        sword: props.sword,
        axe: props.axe,
        archer: props.archer,
        spy: props.spy,
        light: props.light,
        marcher: props.marcher,
        heavy: props.heavy
    }
});

const keepModalOpen = ref<boolean>(false);
const saveDisabled = computed<boolean>(() => {
    if (!isString(templateUnits.type)) return true;
    if (Object.values(templateUnits.units).some((value) => !isInteger(value) || value < 0)) return true;
    if (Object.values(templateUnits.units).every((value) => value === 0)) return true;
    return false;
});

const unitRule: FormItemRule = {
    type: 'number',
    trigger: ['input', 'blur'],
    validator(_rule, value: unknown) {
        if (!isInteger(value)) {
        return new Error('Valor inválido');
        } else if (value < 0) {
            return new Error('Valor inválido');
        } else if (value > 9999) {
            return new Error('Valor inválido');
        };

        return true;
    }
};

const rules: FormRules = {
    type: [
        {
            required: true,
            validator(_rule, value: unknown) {
                if (!isString(value)) {
                    return new Error('É preciso dar um nome ao modelo');
                } else if (/^[aAbBcC]{1}$/.test(value)) {
                    return new Error('Nome inválido');
                } else if (templates.value.some((t) => t.type === value && t.alias === props.userAlias)) {
                    return new Error('Já existe um modelo com esse nome');
                };

                return true;
            },
            trigger: ['input', 'blur']
        }
    ],
    units: {
        spear: unitRule,
        sword: unitRule,
        axe: unitRule,
        archer: unitRule,
        spy: unitRule,
        light: unitRule,
        marcher: unitRule,
        heavy: unitRule
    }
};

const numberInputProps = {
    min: 0,
    max: 9999,
    arrowUp: true,
    arrowDown: true,
    step: 1,
    marginRight: 0,
    validator: (value: unknown) => isInteger(value) && value >= 0
};

async function save() {
    try {
        const rawTemplateUnits = { ...toRaw(templateUnits) };
        const status = await ipcInvoke('save-custom-plunder-template', rawTemplateUnits);
        if (status !== true) throw status;

        message.success('Modelo salvo com sucesso!');
        templates.value.push(rawTemplateUnits);
        if (!keepModalOpen.value) show.value = false;
        await resetTemplate();

    } catch (err) {
        message.error('Ocorreu algum erro :(');
        ModuleError.catch(err);
    };
};

function reset() {
    const status = dialog.warning({
        title: 'Tem certeza?',
        content: 'Todos os valores serão resetados.',
        positiveText: 'Sim',
        negativeText: 'Cancelar',
        onPositiveClick: async () => {
            status.loading = true;
            await resetTemplate();
            message.success('Tudo certo!');
        }
    });
};

async function cancel() {
    show.value = false;
    await resetTemplate();
};

async function resetTemplate() {
    templateUnits.type = '';
    templateUnits.description = null;
    for (const unit of Object.keys(templateUnits.units) as (keyof typeof templateUnits.units)[]) {
        templateUnits.units[unit] = 0;
    };

    await nextTick();
};
</script>

<template>
    <NModal v-model:show="show" title="Criação de Modelo" :close-on-esc="false" :auto-focus="false">
        <div class="form-modal">
            <NForm label-placement="top" :model="templateUnits" :rules="rules" size="small">
                <NFormItem label="Nome" path="type" required>
                    <NInput
                        v-model:value.trim="templateUnits.type"
                        type="text"
                        placeholder="Digite um nome"
                        :minlength="1"
                        :maxlength="15"
                    />
                </NFormItem>

                <NFormItem label="Descrição" path="description">
                    <NInput 
                        v-model:value.trim="templateUnits.description"
                        type="text" 
                        placeholder="Descreva o modelo"
                        :maxlength="250"
                    />
                </NFormItem>

                <NGrid :cols="isArcherWorld ? 4 : 3" :x-gap="6" :y-gap="10">
                    <NFormItemGi path="units.spear">
                        <template #label>
                            <SpearIcon />
                        </template>
                        <InputNumber v-model:value="templateUnits.units.spear" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.sword">
                        <template #label>
                            <SwordIcon />
                        </template>
                        <InputNumber v-model:value="templateUnits.units.sword" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.axe">
                        <template #label>
                            <AxeIcon />
                        </template>
                        <InputNumber v-model:value="templateUnits.units.axe" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.archer" v-if="props.isArcherWorld">
                        <template #label>
                            <ArcherIcon />
                        </template>
                        <InputNumber v-model:value="templateUnits.units.archer" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.spy">
                        <template #label>
                            <SpyIcon />
                        </template>
                        <InputNumber v-model:value="templateUnits.units.spy" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.light">
                        <template #label>
                            <LightIcon />
                        </template>
                        <InputNumber v-model:value="templateUnits.units.light" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.marcher" v-if="props.isArcherWorld">
                        <template #label>
                            <MarcherIcon />
                        </template>
                        <InputNumber v-model:value="templateUnits.units.marcher" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.heavy">
                        <template #label>
                            <HeavyIcon />
                        </template>
                        <InputNumber v-model:value="templateUnits.units.heavy" v-bind="numberInputProps" />
                    </NFormItemGi>
                </NGrid>

                <div class="button-area">
                    <div>
                        <NCheckbox v-model:checked="keepModalOpen">
                            Manter janela aberta após salvar
                        </NCheckbox>
                    </div>
                    <NButtonGroup>
                        <NButton @click="cancel">Cancelar</NButton>
                        <NButton @click="reset">Limpar</NButton>
                        <NButton @click="save" type="primary" :disabled="saveDisabled">Salvar</NButton>
                    </NButtonGroup>
                </div>
            </NForm>
        </div>
    </NModal>
</template>

<style scoped lang="scss">
.form-modal {
    background-color: var(--color-background-mute);
    padding: 1.5em;
    border-radius: 5px;

    .button-area {
        display: flex;
        justify-content: space-between;
    }
}
</style>