<script setup lang="ts">
import { computed, nextTick, reactive, ref, toRaw } from 'vue';
import { useVModels } from '@vueuse/core';
import { useDialog, useMessage } from 'naive-ui';
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
import {
    NModal,
    NForm,
    NFormItem,
    NFormItemGi,
    NGrid,
    NInput,
    NInputNumber,
    NButton,
    NButtonGroup,
    NCheckbox,
    type FormRules,
    type FormItemRule
} from 'naive-ui';

interface Props {
    show: boolean;
    userAlias: UserAlias;
    isArcherWorld: boolean;
    // eslint-disable-next-line vue/no-unused-properties
    templates: CustomPlunderTemplateType[];

    spear: number;
    sword: number;
    axe: number;
    archer: number;
    spy: number;
    light: number;
    marcher: number;
    heavy: number;
}

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

const dialog = useDialog();
const message = useMessage();

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
    if (typeof templateUnits.type !== 'string' || templateUnits.type.length === 0) return true;
    if (Object.values(templateUnits.units).some((value) => !Number.isInteger(value) || value < 0)) return true;
    if (Object.values(templateUnits.units).every((value) => value === 0)) return true;
    return false;
});

const unitRule: FormItemRule = {
    type: 'number',
    trigger: ['input', 'blur'],
    validator(_rule, value: unknown) {
        if (typeof value !== 'number' || !Number.isInteger(value)) {
        return new Error('Valor inválido');
        } else if (value < 0) {
            return new Error('Valor inválido');
        } else if (value > 9999) {
            return new Error('Valor inválido');
        }

        return true;
    }
};

const rules: FormRules = {
    type: [
        {
            required: true,
            validator(_rule, value: unknown) {
                if (typeof value !== 'string' || value.length === 0) {
                    return new Error('É preciso dar um nome ao modelo');
                } else if (/^[aAbBcC]{1}$/.test(value)) {
                    return new Error('Nome inválido');
                } else if (templates.value.some((t) => t.type === value && t.alias === props.userAlias)) {
                    return new Error('Já existe um modelo com esse nome');
                }

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
    validator: (value: unknown) => {
        if (typeof value !== 'number' || !Number.isInteger(value)) return false;
        if (value < 0) return false;
        if (value > 9999) return false;
        return true;
    }
};

async function save() {
    try {
        const rawTemplateUnits = { ...toRaw(templateUnits) };
        const saved = await ipcInvoke('plunder:save-custom-template', rawTemplateUnits);
        if (saved) {
            message.success('Modelo salvo com sucesso!');
            templates.value.push(rawTemplateUnits);
            if (!keepModalOpen.value) show.value = false;
            await resetTemplate();
        } else {
            message.error('Ocorreu algum erro :(');
        }

    } catch (err) {
        RendererProcessError.catch(err);
    }
}

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
}

async function cancel() {
    show.value = false;
    await resetTemplate();
}

async function resetTemplate() {
    templateUnits.type = '';
    templateUnits.description = null;
    for (const unit of Object.keys(templateUnits.units) as (keyof typeof templateUnits.units)[]) {
        templateUnits.units[unit] = 0;
    }

    await nextTick();
}
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
                            <SpearIcon18 />
                        </template>
                        <NInputNumber v-model:value="templateUnits.units.spear" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.sword">
                        <template #label>
                            <SwordIcon18 />
                        </template>
                        <NInputNumber v-model:value="templateUnits.units.sword" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.axe">
                        <template #label>
                            <AxeIcon18 />
                        </template>
                        <NInputNumber v-model:value="templateUnits.units.axe" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi v-if="props.isArcherWorld" path="units.archer">
                        <template #label>
                            <ArcherIcon18 />
                        </template>
                        <NInputNumber v-model:value="templateUnits.units.archer" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.spy">
                        <template #label>
                            <SpyIcon18 />
                        </template>
                        <NInputNumber v-model:value="templateUnits.units.spy" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.light">
                        <template #label>
                            <LightIcon18 />
                        </template>
                        <NInputNumber v-model:value="templateUnits.units.light" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi v-if="props.isArcherWorld" path="units.marcher">
                        <template #label>
                            <MarcherIcon18 />
                        </template>
                        <NInputNumber v-model:value="templateUnits.units.marcher" v-bind="numberInputProps" />
                    </NFormItemGi>

                    <NFormItemGi path="units.heavy">
                        <template #label>
                            <HeavyIcon18 />
                        </template>
                        <NInputNumber v-model:value="templateUnits.units.heavy" v-bind="numberInputProps" />
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
                        <NButton :disabled="saveDisabled" type="primary" @click="save">Salvar</NButton>
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