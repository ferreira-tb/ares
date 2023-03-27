<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useIpcRendererOn } from '@vueuse/electron';
import { isObject, assertKeyOf, toNull, isPositiveInteger, isPositiveNumber } from '@tb-dev/ts-guard';
import { NDivider, NGrid, NGridItem, NSelect, NButton, NButtonGroup, useDialog, useMessage } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$global/ipc';
import { ModuleConfigError } from '$modules/error';
import { assertUserAlias, isDistance } from '$global/utils/guards';
import InfoResult from '$vue/components/result/InfoResult.vue';
import WallInput from '$vue/components/input/WallInput.vue';
import NumberImput from '$vue/components/input/NumberInput.vue';
import LabelPopover from '$vue/components/popover/LabelPopover.vue';
import type {
    PlunderConfigType,
    PlunderConfigKeys,
    PlunderConfigValues,
    BlindAttackPattern,
    UseCPattern
} from '$types/plunder.js';

const dialog = useDialog();
const message = useMessage();

const previousConfig = toNull(await ipcInvoke('get-plunder-config'), isObject);
const config = ref<PlunderConfigType | null>(previousConfig);
const groups = ref(await ipcInvoke('get-village-groups'));

// Refs das configurações.
const wallLevelToIgnore = ref<number>(config.value?.wallLevelToIgnore ?? 1);
const wallLevelToDestroy = ref<number>(config.value?.wallLevelToDestroy ?? 1);
const destroyWallMaxDistance = ref<number>(config.value?.destroyWallMaxDistance ?? 20);
const attackDelay = ref<number>(config.value?.attackDelay ?? 200);
const resourceRatio = ref<number>(config.value?.resourceRatio ?? 0.8);
const minutesUntilReload = ref<number>(config.value?.minutesUntilReload ?? 10);
const maxDistance = ref<number>(config.value?.maxDistance ?? 20);
const ignoreOlderThan = ref<number>(config.value?.ignoreOlderThan ?? 10);
const plunderedResourcesRatio = ref<number>(config.value?.plunderedResourcesRatio ?? 1);
const plunderGroupID = ref<number | null>(config.value?.plunderGroupID ?? null);
const pageDelay = ref<number>(config.value?.pageDelay ?? 2000);

const blindAttackPattern = ref<BlindAttackPattern>(config.value?.blindAttackPattern ?? 'smaller');
const useCPattern = ref<UseCPattern>(config.value?.useCPattern ?? 'normal');

// Watchers.
watch(wallLevelToIgnore, (v) => updateConfig('wallLevelToIgnore', v));
watch(wallLevelToDestroy, (v) => updateConfig('wallLevelToDestroy', v));
watch(destroyWallMaxDistance, (v) => updateConfig('destroyWallMaxDistance', v));
watch(attackDelay, (v) => updateConfig('attackDelay', v));
watch(resourceRatio, (v) => updateConfig('resourceRatio', v));
watch(minutesUntilReload, (v) => updateConfig('minutesUntilReload', v));
watch(maxDistance, (v) => updateConfig('maxDistance', v));
watch(ignoreOlderThan, (v) => updateConfig('ignoreOlderThan', v));
watch(plunderedResourcesRatio, (v) => updateConfig('plunderedResourcesRatio', v));
watch(plunderGroupID, (v) => updateConfig('plunderGroupID', v));
watch(pageDelay, (v) => updateConfig('pageDelay', v));

watch(blindAttackPattern, (v) => updateConfig('blindAttackPattern', v));
watch(useCPattern, (v) => updateConfig('useCPattern', v));

// Atualiza o estado local do Plunder sempre que ocorre uma mudança.
useIpcRendererOn('plunder-config-updated', (_e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
    try {
        if (!isObject(config.value)) return;
        assertKeyOf<PlunderConfigType>(key, config.value, `${key} não é uma configuração válida para o Plunder.`);
        Reflect.set(config, key, value);
    } catch (err) {
        ModuleConfigError.catch(err);
    };
});

function updateConfig(name: 'plunderGroupID', value: number | null): void;
function updateConfig(name: 'blindAttackPattern', value: BlindAttackPattern): void;
function updateConfig(name: 'useCPattern', value: UseCPattern): void;
function updateConfig(name: PlunderConfigKeys, value: number): void;
function updateConfig(name: PlunderConfigKeys, value: PlunderConfigValues) {
    if (!isObject(config.value)) return;
    Reflect.set(config.value, name, value);
    ipcSend('update-plunder-config', name, value);
};

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

// Opções dos NSelect.
type PatternOption<T> = ReadonlyArray<{
    label: string;
    value: T;
}>;

type BlindAttackOptions = PatternOption<BlindAttackPattern>;
type UseCOptions = PatternOption<UseCPattern>;

const blindAttackOptions = [
    {
        label: 'Menor capacidade',
        value: 'smaller'
    },
    {
        label: 'Maior capacidade',
        value: 'bigger'
    }
] satisfies BlindAttackOptions;

const useCOptions = [
    {
        label: 'Normal',
        value: 'normal'
    },
    {
        label: 'Somente C',
        value: 'only'
    }
] satisfies UseCOptions;

const plunderGroupOptions = computed(() => {
    const groupsArray = Array.from(groups.value).filter((group) => group.type === 'dynamic');
    const options = groupsArray.map((group) => ({
        label: decodeURIComponent(group.name),
        value: group.id
    }));

    return options.sort((a, b) => a.label.localeCompare(b.label, 'pt-br'));
});
</script>

<template>
    <section v-if="config" class="plunder-config">
        <NDivider title-placement="left">Ataque</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <LabelPopover>
                    <template #trigger>Distância máxima</template>
                    <span>O Ares não atacará aldeias cuja distância (em campos) é maior do que a indicada.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="maxDistance" :min="1" :max="9999" :step="1" :validator="(v) => isDistance(v)" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Evitar relatórios mais antigos que</template>
                    <span>
                        Se o último ataque ocorreu a uma quantidade de horas superior a indicada, o Ares não atacará a
                        aldeia.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="ignoreOlderThan" :min="1" :max="9999" :step="1"
                    :validator="(v) => isPositiveInteger(v) && v >= 1" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Delay entre ataques</template>
                    <span>
                        O jogo possui um limite de cinco ações por segundo, então o Ares dá uma atrasadinha em cada ataque.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="attackDelay" :min="100" :max="5000" :step="10"
                    :validator="(v) => isPositiveInteger(v) && v >= 100 && v <= 5000" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Razão de saque</template>
                    <span>
                        Corresponde à razão entre a quantidade de recursos na aldeia e a capacidade de carga do modelo
                        atacante.
                        Quanto menor for a razão, maior a chance de tropas serem enviadas desnecessariamente.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="resourceRatio" :min="0.2" :max="1" :step="0.05"
                    :validator="(v) => isPositiveNumber(v) && v >= 0.2 && v <= 1" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Padrão do ataque às cegas</template>
                    <span>
                        Determina como o Ares escolherá o modelo para atacar quando não houver informações de exploradores.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <div class="plunder-config-select">
                    <NSelect v-model:value="blindAttackPattern" :options="blindAttackOptions" />
                </div>
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Padrão do modelo C</template>
                    <span>
                        Quanto o uso do modelo C está ativado, o Ares tentará enviar ataques usando-o.
                        Se não conseguir, tentará com algum outro modelo.

                        Você pode alterar esse comportamento de maneira a forçá-lo a usar somente o modelo C.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <div class="plunder-config-select">
                    <NSelect v-model:value="useCPattern" :options="useCOptions" />
                </div>
            </NGridItem>
        </NGrid>

        <NDivider title-placement="left">Grupo</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <LabelPopover>
                    <template #trigger>Grupo de ataque</template>
                    <span>Determina qual grupo será utilizado ao se atacar em grupo. Apenas grupos dinâmicos são permitidos.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <div class="plunder-config-select">
                    <NSelect
                        v-model:value="plunderGroupID"
                        :options="plunderGroupOptions"
                        placeholder="Selecione um grupo"
                        :disabled="plunderGroupOptions.length === 0"
                    />
                </div>
            </NGridItem>
        </NGrid>

        <NDivider title-placement="left">Muralha</NDivider>
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

        <NDivider title-placement="left">Outros</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <LabelPopover>
                    <template #trigger>Recarregamento automático</template>
                    <span>Tempo, em minutos, até que a página seja recarregada automaticamente durante o saque.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="minutesUntilReload" :min="1" :max="60" :step="1"
                    :validator="(v) => isPositiveInteger(v) && v >= 1 && v <= 60" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Estimativa de saque</template>
                    <span>
                        Por padrão, o Ares sempre considera que o modelo atacante saqueará 100% de sua capacidade de carga.
                        Você pode alterar isso para que ele considere uma porcentagem menor.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="plunderedResourcesRatio" :min="0.2" :max="1" :step="0.05"
                    :validator="(v) => isPositiveNumber(v) && v >= 0.2 && v <= 1" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Delay entre troca de páginas</template>
                    <span>
                        Quando o Ares não encontra aldeias para atacar, ele tenta trocar de página.
                        Esse delay determina quantos milisegundos o Ares deve esperar antes dessa tentativa.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="pageDelay" :min="1000" :max="10000" :step="100"
                    :validator="(v) => isPositiveInteger(v) && v >= 1000 && v <= 10000" />
            </NGridItem>
        </NGrid>
    </section>

    <InfoResult v-else title="Você está logado?"
        description="É necessário estar logado para acessar as configurações do assistente de saque." />
</template>

<style scoped lang="scss">
.plunder-config {
    padding-bottom: 2em;

    .plunder-config-select {
        margin-right: 0.5em;
    }
}
</style>