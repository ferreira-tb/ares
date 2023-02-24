<script setup lang="ts">
import { ref, watch } from 'vue';
import { useIpcRenderer } from '@vueuse/electron';
import { isObject, assertKeyOf, toNull, isPositiveInteger, isPositiveNumber } from '@tb-dev/ts-guard';
import { NDivider, NGrid, NGridItem, NSelect, NButton, NButtonGroup, useDialog, useMessage } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$global/ipc.js';
import { ModuleConfigError } from '$modules/error.js';
import { assertUserAlias } from '$global/utils/guards';
import InfoResult from '$vue/components/result/InfoResult.vue';
import WallInput from '$vue/components/input/WallInput.vue';
import NumberImput from '$vue/components/input/NumberInput.vue';
import Popover from '$vue/components/popover/Popover.vue';
import type { PlunderConfigType, PlunderConfigKeys, PlunderConfigValues, BlindAttackPattern } from '$types/plunder.js';

const dialog = useDialog();
const message = useMessage();

const previousConfig = toNull(await ipcInvoke('get-plunder-config'), isObject);
const config = ref<PlunderConfigType | null>(previousConfig);

const blindAttackPattern = ref<BlindAttackPattern>(config.value?.blindAttackPattern ?? 'smaller');
watch(blindAttackPattern, (v) => updateConfig('blindAttackPattern', v));

// Opções do NSelect.
interface BlindAttackPatternOption {
    label: string;
    value: BlindAttackPattern;
}

const blindAttackOptions = [
    {
        label: 'Menor capacidade',
        value: 'smaller'
    },
    {
        label: 'Maior capacidade',
        value: 'bigger'
    }
] satisfies BlindAttackPatternOption[];

// Atualiza o estado local do Plunder sempre que ocorre uma mudança.
const ipcRenderer = useIpcRenderer();
ipcRenderer.on('plunder-config-updated', (_e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
    try {
        if (!isObject(config.value)) return;
        assertKeyOf<PlunderConfigType>(key, config.value, `${key} não é uma configuração válida para o Plunder.`);
        Reflect.set(config, key, value);
    } catch (err) {
        ModuleConfigError.catch(err);
    };
});

function updateConfig(name: 'wallLevelToIgnore', value: number): void;
function updateConfig(name: 'wallLevelToDestroy', value: number): void;
function updateConfig(name: 'attackDelay', value: number): void;
function updateConfig(name: 'blindAttackPattern', value: BlindAttackPattern): void;
function updateConfig(name: 'resourceRatio', value: number): void;
function updateConfig(name: 'minutesUntilReload', value: number): void;
function updateConfig(name: 'maxDistance', value: number): void;
function updateConfig(name: 'ignoreOlderThan', value: number): void;
function updateConfig(name: PlunderConfigKeys, value: PlunderConfigValues) {
    if (!isObject(config.value)) return;
    Reflect.set(config.value, name, value);
    ipcSend('update-plunder-config', name, value);
};

function resetDemolitionConfig() {
    const status = dialog.warning({
        title: 'Tem certeza?',
        content: 'Essa ação é irreversível! Não há como voltar atrás.',
        positiveText: 'Sim',
        negativeText: 'Cancelar',
        onPositiveClick: async () => {
            status.loading = true;
            try {
                const userAlias = await ipcInvoke('user-alias');
                assertUserAlias(userAlias, ModuleConfigError);
                const result = await ipcInvoke('destroy-demolition-troops-config', userAlias);
                if (result !== true) throw result;
                message.success('Resetado com sucesso!', { duration: 2000 });

            } catch (err) {
                ModuleConfigError.catch(err);
                message.error('Ocorreu algum erro :(', { duration: 2000 });
            }; 
        },
        onNegativeClick: () => {
            message.info('Talvez tenha sido melhor assim...', { duration: 2000 });
        }
    });
};
</script>

<template>
    <section v-if="config">
        <NDivider title-placement="left">Ataque</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <Popover>
                    <template #trigger>Distância máxima</template>
                    <span>O Ares não atacará aldeias cuja distância (em campos) é maior do que a indicada.</span>
                </Popover>
            </NGridItem>
            <NGridItem>
                <NumberImput :value="config.maxDistance" :min="1" :max="9999" :step="1"
                    :validator="(v) => isPositiveNumber(v) && v >= 1"
                    @value-updated="(v) => updateConfig('maxDistance', v)" />
            </NGridItem>

            <NGridItem>
                <Popover>
                    <template #trigger>Evitar relatórios mais antigos que</template>
                    <span>
                        Se o último ataque ocorreu a uma quantidade de horas superior a indicada, o Ares não atacará a aldeia.
                    </span>
                </Popover>
            </NGridItem>
            <NGridItem>
                <NumberImput :value="config.ignoreOlderThan" :min="1" :max="9999" :step="1"
                    :validator="(v) => isPositiveInteger(v) && v >= 1"
                    @value-updated="(v) => updateConfig('ignoreOlderThan', v)" />
            </NGridItem>

            <NGridItem>
                <Popover>
                    <template #trigger>Delay médio entre os ataques</template>
                    <span>
                        O jogo possui um limite de cinco ações por segundo, então o Ares dá uma atrasadinha em cada ataque.
                    </span>
                </Popover>
            </NGridItem>
            <NGridItem>
                <NumberImput :value="config.attackDelay" :min="100" :max="5000" :step="10"
                    :validator="(v) => isPositiveInteger(v) && v >= 100 && v <= 5000"
                    @value-updated="(v) => updateConfig('attackDelay', v)" />
            </NGridItem>

            <NGridItem>
                <Popover>
                    <template #trigger>Razão de saque</template>
                    <span>
                        Corresponde à razão entre a quantidade de recursos na aldeia e a capacidade de carga do modelo atacante.
                        Quanto menor for a razão, maior a chance de tropas serem enviadas desnecessariamente.
                    </span>
                </Popover>
            </NGridItem>
            <NGridItem>
                <NumberImput :value="config.resourceRatio" :min="0.2" :max="1" :step="0.05"
                    :validator="(v) => isPositiveNumber(v) && v >= 0.2 && v <= 1"
                    @value-updated="(v) => updateConfig('resourceRatio', v)" />
            </NGridItem>

            <NGridItem>
                <Popover>
                    <template #trigger>Recarregamento automático</template>
                    <span>Tempo, em minutos, até que a página seja recarregada automaticamente durante o saque.</span>
                </Popover>
            </NGridItem>
            <NGridItem>
                <NumberImput :value="config.minutesUntilReload" :min="1" :max="60" :step="1"
                    :validator="(v) => isPositiveInteger(v) && v >= 1 && v <= 60"
                    @value-updated="(v) => updateConfig('minutesUntilReload', v)" />
            </NGridItem>

            <NGridItem>
                <Popover>
                    <template #trigger>Lógica do ataque às cegas</template>
                    <span>
                        Determina como o Ares escolherá o modelo para atacar quando não houver informações de exploradores.
                    </span>
                </Popover>
            </NGridItem>
            <NGridItem>
                <div class="plunder-config-select">
                    <NSelect v-model:value="blindAttackPattern" :options="blindAttackOptions" />
                </div>
            </NGridItem>
        </NGrid>

        <NDivider title-placement="left">Muralha</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <Popover>
                    <template #trigger>Ignorar muralhas a partir de</template>
                    <span>Determina a partir de qual nível de muralha o Ares deve ignorar aldeias.</span>
                </Popover>
            </NGridItem>
            <NGridItem>
                <WallInput :value="config.wallLevelToIgnore" @level-updated="(v) => updateConfig('wallLevelToIgnore', v)" />
            </NGridItem>

            <NGridItem>
                <Popover>
                    <template #trigger>Destruir muralhas a partir de</template>
                    <span>O Ares não destruirá muralhas cujo nível seja menor que o indicado.</span>
                </Popover>
            </NGridItem>
            <NGridItem>
                <WallInput :value="config.wallLevelToDestroy"
                    @level-updated="(v) => updateConfig('wallLevelToDestroy', v)" />
            </NGridItem>

            <NGridItem>
                <Popover>
                    <template #trigger>Tropas de demolição</template>
                    <span>Por padrão, o Ares envia bárbaros e aríetes para destruir as muralhas, mas você pode mudar isso!</span>
                </Popover>
            </NGridItem>
            <NGridItem>
                <NButtonGroup>
                    <NButton @click="ipcSend('open-demolition-troops-config-window')">Configurar</NButton>
                    <NButton @click="resetDemolitionConfig">Resetar</NButton>
                </NButtonGroup>
            </NGridItem>
        </NGrid>
    </section>

    <InfoResult v-else title="Você está logado?"
        description="É necessário estar logado para acessar as configurações do assistente de saque." />
</template>

<style scoped>
.plunder-config-select {
    margin-right: 0.5em;
}
</style>