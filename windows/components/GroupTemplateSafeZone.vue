<script setup lang="ts">
import { h, computed, ref, toRaw, toRef } from 'vue';
import { watchImmediate } from '@vueuse/core';
import { useDiplomacy, useAllyVillages, usePlayerVillages } from '$renderer/composables';
import { ipcInvoke } from '$renderer/ipc';
import { useGameDataStore } from '$renderer/stores';
import { formatFields, parseFields } from '$windows/utils/input-parser';
import { RendererWorker } from '$renderer/worker';
import { RendererProcessError } from '$renderer/error';
import { RendererWorkerName } from '$common/constants';
import {
    NButton,
    NDataTable,
    NEllipsis,
    NGrid,
    NGridItem,
    NInput,
    NInputNumber,
    useDialog,
    useMessage,
    type DataTableColumns
} from 'naive-ui';

const emit = defineEmits<{
    (e: 'template-name', value: string): void;
}>();

const dialog = useDialog();
const message = useMessage();
const locale = await ipcInvoke('app:locale');

const gameData = useGameDataStore();
const gameDataFromMainProcess = await ipcInvoke('game:data');
if (gameDataFromMainProcess) gameData.$patch(gameDataFromMainProcess);

const diplomacy = useDiplomacy();
const playerVillages = usePlayerVillages(toRef(() => gameData.player.id));

const enemies = computed(() => diplomacy.value?.enemies.map((ally) => ally.id) ?? []);
const enemyVillages = useAllyVillages(enemies);

const fields = ref(30);
const groupName = ref<string>('Zona segura');

const disableCreation = computed(() => {
    if (!diplomacy.value) return true;
    if (diplomacy.value.enemies.length === 0) return true;
    if (playerVillages.value.length === 0) return true;
    if (enemyVillages.value.length === 0) return true;
    return false;
});

const isCreating = ref(false);
const buttonText = computed(() => {
    if (isCreating.value) return 'Criando grupo...';
    return 'Criar grupo';
});

watchImmediate(groupName, (newName) => {
    emit('template-name', newName);
});

const columns: DataTableColumns<WorldAllyType> = [
    {
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Nome' }),
        key: 'name',
        resizable: true,
        render: (row) => h(NEllipsis, { tooltip: false, textContent: row.name }),
        sorter: (a, b) => a.name.localeCompare(b.name, locale)
    },
    {
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Tag' }),
        key: 'tag',
        resizable: true,
        render: (row) => h(NEllipsis, { tooltip: false, textContent: row.tag }),
        sorter: (a, b) => a.tag.localeCompare(b.tag, locale)
    },
    {
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Membros' }),
        key: 'members',
        resizable: true,
        render: (row) => h(NEllipsis, { tooltip: false, textContent: row.members.toLocaleString(locale) }),
        sorter: (a, b) => a.members - b.members
    },
    {
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Pontos' }),
        key: 'points',
        resizable: true,
        render: (row) => h(NEllipsis, { tooltip: false, textContent: row.points.toLocaleString(locale) }),
        sorter: (a, b) => a.points - b.points,
        defaultSortOrder: 'descend'
    }
];

function createGroup() {
    const status = dialog.warning({
        title: 'Deseja continuar?',
        content: 'A criação do grupo pode levar algum tempo.',
        positiveText: 'Sim',
        negativeText: 'Cancelar',
        onPositiveClick: async () => {
            status.loading = true;
            isCreating.value = true;

            let worker: RendererWorker | null = null;
            try {
                worker = await RendererWorker.create(RendererWorkerName.CalcSafeZoneVillages);
                if (!worker) throw new RendererProcessError('Failed to create worker');

                const result = await worker.invoke<WorldVillageType[]>({
                    playerVillages: toRaw(playerVillages.value),
                    enemyVillages: toRaw(enemyVillages.value),
                    fields: fields.value
                });
                
                const newGroup = await ipcInvoke('game:create-static-group', groupName.value);
                if (!newGroup) throw new RendererProcessError('Failed to create static group');

                const ids = result.map((v) => v.id);
                const didAddVillages = await ipcInvoke('game:add-villages-to-group', newGroup.id, ids);
                if (didAddVillages) {
                    message.success('Grupo criado com sucesso');
                } else {
                    throw new RendererProcessError('Failed to add villages to group');
                };

            } catch (err) {
                RendererProcessError.catch(err);
                message.error('Não foi possível criar o grupo');

            } finally {
                isCreating.value = false;
                worker?.destroy();
            };
        }
    });
};
</script>

<template>
    <section>
        <div class="header">
            <NGrid :cols="2" :x-gap="6" :y-gap="10">
                <NGridItem :span="2">
                    <div class="header-title">Zona segura</div>
                </NGridItem>

                <NGridItem>
                    <div class="config-label">Nome do grupo</div>
                </NGridItem>
                <NGridItem>
                    <div class="config-input">
                        <NInput
                            v-model:value.trim="groupName"
                            placeholder="Nome do grupo"
                            :minlength="1"
                            :maxlength="20"
                            :allow-input="(value) => /^[\x00-\x7F]+$/.test(value)"
                        />
                    </div>
                </NGridItem>

                <NGridItem>
                    <div class="config-label">Campos até o inimigo mais próximo</div>
                </NGridItem>
                <NGridItem>
                    <NInputNumber
                        v-model:value="fields"
                        class="config-input"
                        :min="1"
                        :max="9999"
                        :step="1"
                        :validator="(v) => Number.isFinite(v) && v >= 1"
                        :format="formatFields"
                        :parse="parseFields"
                    />
                </NGridItem>
            </NGrid>
        </div>

        <div class="button-area">
            <NButton :disabled="disableCreation" @click="createGroup">
                {{ buttonText }}
            </NButton>
        </div>

        <Transition name="tb-fade" mode="out-in">
            <div class="enemies-table">
                <NDataTable
                    v-if="diplomacy && diplomacy.enemies.length > 0"
                    :data="(diplomacy.enemies as WorldAllyType[])"
                    :columns="columns"
                    :max-height="300"
                    :row-key="(row: WorldAllyType) => row.id"
                />
            </div>
        </Transition>
    </section>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

.header {
    @include main.flex-x-center-y-center;
    padding: 0.5em;
}

.header-title {
    @include main.flex-x-center-y-center;
    padding-bottom: 0.5em;
    font-size: 1.5em;
    font-weight: 500;
}

.button-area {
    @include main.flex-x-center-y-center;
    padding-top: 1em;
    padding-bottom: 0.5em;
}

.enemies-table {
    margin: 1em;
}
</style>