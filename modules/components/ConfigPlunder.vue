<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useIpcRendererOn } from '@vueuse/electron';
import { assertKeyOf, isPositiveInteger, isPositiveNumber } from '@tb-dev/ts-guard';
import { NDivider, NGrid, NGridItem, NSelect, NButton, NButtonGroup, useDialog, useMessage } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$global/ipc';
import { ModuleConfigError } from '$modules/error';
import { assertUserAlias, isDistance } from '$global/utils/guards';
import InfoResult from '$global/components/result/InfoResult.vue';
import WallInput from '$global/components/input/WallInput.vue';
import NumberImput from '$global/components/input/NumberInput.vue';
import LabelPopover from '$global/components/popover/LabelPopover.vue';
import ConfigPlunderGridAttack from '$modules/components/ConfigPlunderGridAttack.vue';
import ConfigPlunderButtonGroups from '$modules/components/ConfigPlunderButtonGroups.vue.js';
import type { VillageGroup } from '$types/game';
import type {
    PlunderConfigType,
    PlunderConfigKeys,
    PlunderConfigValues,
    BlindAttackPattern,
    UseCPattern
} from '$types/plunder';

const dialog = useDialog();
const message = useMessage();

const previousConfig = await ipcInvoke('get-plunder-config');
const config = ref<PlunderConfigType | null>(previousConfig);

const previousGroups = await ipcInvoke('get-village-groups');
const groups = ref(previousGroups);

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
const pageDelay = ref<number>(config.value?.pageDelay ?? 2000);
const villageDelay = ref<number>(config.value?.villageDelay ?? 2000);

const plunderGroupId = ref<number | null>(config.value?.plunderGroupId ?? null);
const fieldsPerWave = ref<number>(config.value?.fieldsPerWave ?? 10);

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
watch(pageDelay, (v) => updateConfig('pageDelay', v));
watch(villageDelay, (v) => updateConfig('villageDelay', v));

watch(plunderGroupId, (v) => updateConfig('plunderGroupId', v));
watch(fieldsPerWave, (v) => updateConfig('fieldsPerWave', v));

watch(blindAttackPattern, (v) => updateConfig('blindAttackPattern', v));
watch(useCPattern, (v) => updateConfig('useCPattern', v));

// Atualiza o estado local do Plunder sempre que ocorre uma mudança.
useIpcRendererOn('plunder-config-updated', (_e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
    try {
        if (!config.value) return;
        assertKeyOf<PlunderConfigType>(key, config.value, `${key} is not a valid key of PlunderConfigType`);
        Reflect.set(config, key, value);
    } catch (err) {
        ModuleConfigError.catch(err);
    };
});

function updateConfig(name: 'plunderGroupId', value: number | null): void;
function updateConfig(name: 'blindAttackPattern', value: BlindAttackPattern): void;
function updateConfig(name: 'useCPattern', value: UseCPattern): void;
function updateConfig(name: PlunderConfigKeys, value: number): void;
function updateConfig(name: PlunderConfigKeys, value: PlunderConfigValues) {
    if (!config.value) return;
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

const plunderGroupOptions = computed(() => {
    const groupsArray = Array.from(groups.value).filter((group) => group.type === 'dynamic');
    const options = groupsArray.map((group) => ({
        label: decodeURIComponent(group.name),
        value: group.id
    }));

    return options.sort((a, b) => a.label.localeCompare(b.label, 'pt-br'));
});

function updateGroups(newGroups: Set<VillageGroup>) {
    groups.value = newGroups;
    const plunderGroup = Array.from(newGroups).find((group) => group.id === plunderGroupId.value);
    if (plunderGroup?.type !== 'dynamic') plunderGroupId.value = null;
};
</script>

<template>
    <section v-if="config" class="plunder-config">
        <ConfigPlunderGridAttack />
        <NDivider title-placement="left" class="config-divider">Grupo</NDivider>
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
                        v-model:value="plunderGroupId"
                        :options="plunderGroupOptions"
                        placeholder="Selecione um grupo"
                        :disabled="plunderGroupOptions.length === 0"
                    />
                </div>
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Campos por onda</template>
                    <span>
                        Ao atacar em grupos, o Ares não envia todos os ataques de uma só vez.
                        Em vez disso, ele envia uma onda de ataques de uma aldeia e então passa para a próxima,
                        repetindo o processo até que todas as aldeias tenham enviado seus ataques.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="fieldsPerWave" :min="5" :max="9999" :step="1" :validator="(v) => isDistance(v)" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Delay entre troca de aldeias</template>
                    <span>
                        Determina quantos milissegundos o Ares deve esperar antes de trocar de aldeia ao atacar em grupo.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="villageDelay" :min="100" :max="60000" :step="100"
                    :validator="(v) => isPositiveInteger(v) && v >= 100 && v <= 60000" />
            </NGridItem>

            <NGridItem :span="2">
                <ConfigPlunderButtonGroups @update-groups="updateGroups" />
            </NGridItem>
        </NGrid>

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

        <NDivider title-placement="left" class="config-divider">Outros</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <LabelPopover>
                    <template #trigger>Atualização automática</template>
                    <span>Tempo, em minutos, até que a página seja atualizada automaticamente durante o saque.</span>
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
                        Esse delay determina quantos milissegundos o Ares deve esperar antes dessa tentativa.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <NumberImput v-model:value="pageDelay" :min="100" :max="60000" :step="100"
                    :validator="(v) => isPositiveInteger(v) && v >= 100 && v <= 60000" />
            </NGridItem>
        </NGrid>
    </section>

    <InfoResult v-else
        title="Você está logado?"
        description="É necessário estar logado para acessar as configurações do assistente de saque."
    />
</template>

<style scoped lang="scss">
.plunder-config {
    padding-bottom: 2em;

    .plunder-config-select {
        margin-right: 0.5em;
    }
}
</style>