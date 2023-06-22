<script setup lang="ts">
import { computed, nextTick, ref, toRef } from 'vue';
import { NGrid, NGridItem, NPageHeader, NResult, NSelect } from 'naive-ui';
import { useGroups, usePlayerVillages, useUserAlias } from '$renderer/composables';
import { useGameDataStore } from '$renderer/stores';
import { ipcInvoke } from '$renderer/ipc';
import { getContinentFromCoords } from '$common/utils';

const locale = await ipcInvoke('app:locale');

const userAlias = useUserAlias();
const gameData = useGameDataStore();
const previousGameData = await ipcInvoke('game:data');
if (previousGameData) gameData.$patch(previousGameData);
await nextTick();

const { groups } = useGroups(userAlias);
const player = toRef(() => gameData.player.id);
const villages = usePlayerVillages(player);

const continents = computed(() => {
    return villages.value.reduce<string[]>((acc, village) => {
        const continent = getContinentFromCoords(village.x, village.y, 'K');
        if (!acc.includes(continent)) acc.push(continent);
        return acc;
    }, []);
});

const selectedGroup = ref(0);
const selectedContinent = ref('all');
const selectedType = ref(0);

const groupOptions = computed(() => {
    const mapped = groups.value.map((group) => ({
        label: group.name,
        value: group.id
    }));

    mapped.push({ label: 'Todos', value: 0 });
    return mapped.sort((a, b) => a.label.localeCompare(b.label, locale));
});

const continentOptions = computed(() => {
    const mapped = Array.from(continents.value).map((continent) => ({
        label: continent,
        value: continent
    }));

    mapped.sort((a, b) => a.label.localeCompare(b.label, locale));
    mapped.unshift({ label: 'Todos', value: 'all' });
    return mapped;
});

const typeOptions = [
    { label: 'Disponível', value: 0 },
    { label: 'Próprias', value: 1 },
    { label: 'Nas aldeias', value: 2 },
    { label: 'Apoios', value: 3 },
    { label: 'Fora', value: 4 },
    { label: 'Em trânsito', value: 5 }
];
</script>

<template>
	<main v-if="userAlias">
        <div id="troop-counter-header">
            <NPageHeader>
                <NGrid :cols="3" :x-gap="12">
                    <NGridItem>
                        <div class="header-select-wrapper">
                            <div class="header-select-label">Grupo</div>
                            <NSelect
                                v-model:value="selectedGroup"
                                :options="groupOptions"
                            />
                        </div>
                    </NGridItem>

                    <NGridItem>
                        <div class="header-select-wrapper">
                            <div class="header-select-label">Continente</div>
                            <NSelect
                                v-model:value="selectedContinent"
                                :options="continentOptions"
                            />
                        </div>
                    </NGridItem>

                    <NGridItem>
                        <div class="header-select-wrapper">
                            <div class="header-select-label">Tipo</div>
                            <NSelect
                                v-model:value="selectedType"
                                :options="typeOptions"
                            />
                        </div>
                    </NGridItem>
                </NGrid>
            </NPageHeader>
        </div>

        <div id="troop-counter-content"></div>
    </main>

    <div v-else class="result-info">
        <NResult
            status="info"
            title="Você está logado?"
            description="É necessário estar logado para usar o contador de tropas."
        />
    </div>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

.header-select-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 100%;

    .header-select-label {
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 4px;
    }
}

.result-info {
    @include main.to-center;
    width: 100%;
}
</style>