<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { NButton, NButtonGroup } from 'naive-ui';
import { computedAsync, watchDeep, watchImmediate, whenever } from '@vueuse/core';
import { useIpcRendererOn } from '@vueuse/electron';
import { useCurrentVillageStore, useSnobConfigStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { useVillage } from '$renderer/composables/village';
import { PanelSnobViewError } from '$panel/error';
import { decodeString } from '$common/helpers';
import TheMintedCoins from '$panel/components/TheMintedCoins.vue';

const config = useSnobConfigStore();
const currentVillage = useCurrentVillageStore();

const snobButtonText = computed(() => config.active ? 'Parar' : 'Cunhar');
const translatedTimeUnit = computed(() => {
    switch (config.timeUnit) {
        case 'seconds': return 'segundos';
        case 'minutes': return 'minutos';
        case 'hours': return 'horas';
        default: throw new PanelSnobViewError('Invalid time unit');
    };
});

const village = useVillage(toRef(() => config.village));
const villageName = computed<string | null>(() => {
    if (!village.value) return null;
    return decodeString(village.value.name);
});

const allGroups = ref(await ipcInvoke('game:get-all-village-groups'));
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

watchImmediate(() => config.active, (active) => {
    if (active && config.mode === 'single' && !config.village) {
        config.active = false;
    };
});

// Quando a cunhagem é ativada, salva a aldeia atual como origem da cunhagem simples.
// Como o watcher não é imediato, ele não irá alterar a aldeia caso a cunhagem já esteja ativa em outra.
whenever(() => config.active, () => {
    if (config.mode === 'single') {
        config.village = currentVillage.id;
    };
});

useIpcRendererOn('game:did-update-village-groups-set', (_e, groups: Set<VillageGroup>) => {
    allGroups.value = groups;
});
</script>

<template>
    <main>
        <div class="button-area">
            <NButtonGroup>
                <NButton
                    round
                    :disabled="config.mode === 'single' && !config.village"
                    @click="config.active = !config.active"
                >
                    {{ snobButtonText }}
                </NButton>
                <NButton round @click="ipcSend('config:open', 'config-buildings-snob')">
                    Configurações
                </NButton>
            </NButtonGroup>
        </div>

        <TheMintedCoins />

        <div class="current-mint-location">
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

        <div class="current-delay">
            <div>Tempo de espera</div>
            <div>{{ `${config.delay} ${translatedTimeUnit}` }}</div>
        </div>
    </main>
</template>

<style scoped lang="scss">
@use '$panel/assets/main.scss';

.button-area {
    @include main.flex-x-center-y-center;
    margin-bottom: 1em;
}

.current-mint-location {
    @include main.flex-x-center-y-center;
    margin-top: 1em;
    
    .location-label {
        margin-bottom: 0.3em;
        font-weight: bold;
    }

    a {
        cursor: pointer;
    }
}

.current-delay {
    margin-top: 0.5em;

    & > div {
        @include main.flex-x-center-y-center;
    }

    & > div:first-child {
        margin-bottom: 0.3em;
        font-weight: bold;
    }
}
</style>