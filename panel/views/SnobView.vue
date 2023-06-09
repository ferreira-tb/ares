<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { NButton, NButtonGroup } from 'naive-ui';
import { computedAsync, watchDeep, whenever } from '@vueuse/core';
import { useCurrentVillageStore, useGroupsStore, useSnobConfigStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { PanelSnobViewError } from '$panel/error';
import { decodeString } from '$common/helpers';
import TheCoinedAmount from '$panel/components/TheCoinedAmount.vue';

const config = useSnobConfigStore();
const currentVillage = useCurrentVillageStore();
const groups = useGroupsStore();

const { all: allGroups } = storeToRefs(groups);
const snobButtonText = computed(() => config.active ? 'Parar' : 'Cunhar');

const village = computedAsync<WorldVillagesType | null>(async () => {
    if (!config.village) return null;
    const data = await ipcInvoke('world-data:get-villages', config.village);
    if (data.length === 0) return null;
    return data[0];
}, null);

const villageName = computed<string | null>(() => {
    if (!village.value) return null;
    return decodeString(village.value.name);
});

const groupName = computedAsync<string | null>(async () => {
    try {
        if (config.group === 0) return 'Todas as aldeias';
        const group = Array.from(allGroups.value).find((g) => g.id === config.group);

        if (!group) {
            const fetched = await ipcInvoke('game:fetch-village-groups');
            if (!fetched) {
                throw new PanelSnobViewError('Error fetching village groups');
            };
            return null;
        };

        return decodeString(group.name);
        
    } catch (err) {
        PanelSnobViewError.catch(err);
        return null;
    };
}, null);

watchDeep(config, () => {
    ipcSend('snob:update-config', config.raw());
});

// Quando a cunhagem é ativada, salva a aldeia atual como origem da cunhagem simples.
// Como o watcher não é imediato, ele não irá alterar a aldeia caso a cunhagem já esteja ativa em outra.
whenever(() => config.active, () => {
    if (config.mode === 'single') {
        config.village = currentVillage.id;
    };
});
</script>

<template>
    <main>
        <div class="button-area">
            <NButtonGroup>
                <NButton round @click="config.active = !config.active">
                    {{ snobButtonText }}
                </NButton>
                <NButton round @click="ipcSend('config:open', 'config-buildings-snob')">
                    Configurações
                </NButton>
            </NButtonGroup>
        </div>

        <TheCoinedAmount />

        <div class="current-coin-location">
            <div v-if="config.mode === 'single'">
                <div class="location-label">Aldeia selecionada</div>
                <a
                    v-if="villageName && village"
                    @click="ipcSend('current-view:navigate-to-snob-train', village.id)"
                >
                    {{ villageName }}
                </a>
                <div v-else>Nenhuma aldeia</div>
            </div>

            <div v-else>
                <div>Grupo selecionado</div>
                <a
                    v-if="groupName && village"
                    @click="ipcSend('current-view:navigate-to-snob-coin', village.id, config.group)"
                >
                    {{ groupName }}
                </a>
                <div v-else>Nenhum grupo</div>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
@use '$panel/assets/main.scss';

.button-area {
    @include main.flex-x-center-y-center;
    margin-bottom: 1em;
}

.current-coin-location {
    @include main.flex-x-center-y-center;
    margin-top: 1em;
    
    .location-label {
        margin-bottom: 0.5em;
        font-weight: bold;
    }

    a {
        cursor: pointer;
    }
}
</style>