<script setup lang="ts">
import { h, computed, nextTick, reactive, ref, toRef, toValue, watchEffect } from 'vue';
import { computedAsync } from '@vueuse/core';
import { NGrid, NGridItem, NPageHeader, NSelect, NSpin } from 'naive-ui';
import { useArcherWorld, useGroups, usePlayerVillages, useUserAlias } from '$renderer/composables';
import { useGameDataStore } from '$renderer/stores';
import { ipcInvoke } from '$renderer/ipc';
import { getContinentFromCoords } from '$common/utils';
import { Units } from '$common/templates';
import { RendererProcessError } from '$renderer/error';
import GroupsButtonUpdate from '$renderer/components/GroupsButtonUpdate.vue';
import LabelAmount from '$renderer/components/LabelAmount.vue';
import ResultGuest from '$renderer/components/ResultGuest.vue';
import ArcherIcon18 from '$icons/units/ArcherIcon18.vue';
import AxeIcon18 from '$icons/units/AxeIcon18.vue';
import HeavyIcon18 from '$icons/units/HeavyIcon18.vue';
import LightIcon18 from '$icons/units/LightIcon18.vue';
import MarcherIcon18 from '$icons/units/MarcherIcon18.vue';
import SpearIcon18 from '$icons/units/SpearIcon18.vue';
import SpyIcon18 from '$icons/units/SpyIcon18.vue';
import SwordIcon18 from '$icons/units/SwordIcon18.vue';
import RamIcon18 from '$icons/units/RamIcon18.vue';
import CatapultIcon18 from '$icons/units/CatapultIcon18.vue';
import KnightIcon18 from '$icons/units/KnightIcon18.vue';
import SnobIcon18 from '$icons/units/SnobIcon18.vue';

const locale = await ipcInvoke('app:locale');

const userAlias = useUserAlias();
const gameData = useGameDataStore();
const previousGameData = await ipcInvoke('game:data');
if (previousGameData) gameData.$patch(previousGameData);
await nextTick();

const isArcherWorld = useArcherWorld(userAlias);
const { groups } = useGroups(userAlias);
const player = toRef(() => gameData.player.id);
const villages = usePlayerVillages(player, userAlias);

const continents = computed(() => {
    return villages.value.reduce<number[]>((acc, village) => {
        const continent = getContinentFromCoords(village.x, village.y).toIntegerStrict();
        if (!acc.includes(continent)) acc.push(continent);
        return acc;
    }, []);
});

const selectedGroup = ref<number>(0);
const selectedContinent = ref<number>(-1);
const selectedType = ref<keyof TroopsCounterResultType>('available');

const counterCache = reactive(new Map<number, Map<number, TroopsCounterResultType>>());
watchEffect(async () => {
    const groupId = toValue(selectedGroup);
    if (counterCache.has(groupId)) return;
    const result = await ipcInvoke('game:count-troops', groupId);
    if (!result) {
        throw new RendererProcessError(`Failed to count troops for group ${groupId}`);
    }

    counterCache.set(groupId, result);
});

const evaluating = ref(false);
const troops = computedAsync<UnitAmount>(async () => {
    const groupId = toValue(selectedGroup);
    const continent = toValue(selectedContinent);
    const type = toValue(selectedType);

    const partial = new Units();
    const results = counterCache.get(groupId);
    if (!results) return partial;

    const groupVillages = await ipcInvoke('world-data:get-village', Array.from(results.keys()));
    if (groupVillages.length === 0) return partial;

    for (const [villageId, result] of results.entries()) {
        if (continent !== -1) {
            const village = groupVillages.find((v) => v.id === villageId);
            if (!village) continue;
            const villageContinent = getContinentFromCoords(village.x, village.y).toIntegerStrict();
            if (villageContinent !== continent) continue;
        }

        Object.entries(result[type]).forEach(([unit, amount]: [keyof Units, number]) => {
            partial[unit] += amount;
        });
    }

    return partial;
}, new Units(), evaluating);

const groupOptions = computed(() => {
    const mapped = groups.value.map((group) => ({
        label: group.name,
        value: group.id
    }));

    mapped.sort((a, b) => a.label.localeCompare(b.label, locale));
    mapped.unshift({ label: 'Todos', value: 0 });
    return mapped;
});

const continentOptions = computed(() => {
    const mapped = Array.from(continents.value).map((continent) => ({
        label: `K${continent.toString(10).padStart(2, '0')}`,
        value: continent
    }));

    mapped.sort((a, b) => a.label.localeCompare(b.label, locale));
    mapped.unshift({ label: 'Todos', value: -1 });
    return mapped;
});

const typeOptions: NSelectOptions<keyof TroopsCounterResultType> = [
    { label: 'Disponível', value: 'available' },
    { label: 'Próprias', value: 'own' },
    { label: 'Nas aldeias', value: 'village' },
    { label: 'Apoios', value: 'support' },
    { label: 'Fora', value: 'away' },
    { label: 'Em trânsito', value: 'moving' }
];
</script>

<template>
	<main v-if="userAlias">
        <div id="troops-counter-header">
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

                <template #footer>
                    <GroupsButtonUpdate />
                </template>
            </NPageHeader>
        </div>

        <Transition name="tb-fade" mode="out-in">
            <div id="troops-counter-content" :key="userAlias">
                <NSpin size="large" :show="evaluating">
                    <NGrid :cols="isArcherWorld ? 4 : 3" :x-gap="12" :y-gap="12">
                        <NGridItem>
                            <LabelAmount :icon="() => h(SpearIcon18)" :amount="troops.spear" />
                        </NGridItem>
                        <NGridItem>
                            <LabelAmount :icon="() => h(SwordIcon18)" :amount="troops.sword" />
                        </NGridItem>
                        <NGridItem>
                            <LabelAmount :icon="() => h(AxeIcon18)" :amount="troops.axe" />
                        </NGridItem>
                        <NGridItem v-if="isArcherWorld">
                            <LabelAmount :icon="() => h(ArcherIcon18)" :amount="troops.archer" />
                        </NGridItem>

                        <NGridItem>
                            <LabelAmount :icon="() => h(SpyIcon18)" :amount="troops.spy" />
                        </NGridItem>
                        <NGridItem>
                            <LabelAmount :icon="() => h(LightIcon18)" :amount="troops.light" />
                        </NGridItem>
                        <NGridItem v-if="isArcherWorld">
                            <LabelAmount :icon="() => h(MarcherIcon18)" :amount="troops.marcher" />
                        </NGridItem>
                        <NGridItem>
                            <LabelAmount :icon="() => h(HeavyIcon18)" :amount="troops.heavy" />
                        </NGridItem>

                        <NGridItem>
                            <LabelAmount :icon="() => h(RamIcon18)" :amount="troops.ram" />
                        </NGridItem>
                        <NGridItem>
                            <LabelAmount :icon="() => h(CatapultIcon18)" :amount="troops.catapult" />
                        </NGridItem>

                        <NGridItem>
                            <LabelAmount :icon="() => h(SnobIcon18)" :amount="troops.snob" />
                        </NGridItem>
                        <NGridItem>
                            <LabelAmount :icon="() => h(KnightIcon18)" :amount="troops.knight" />
                        </NGridItem>
                    </NGrid>

                    <template #description>
                        Carregando...
                    </template>
                </NSpin>
            </div>
        </Transition>
    </main>

    <ResultGuest
        v-else
        description="É necessário estar logado para usar o contador de tropas."
        to-center
    />
</template>

<style scoped lang="scss">
.header-select-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    height: 100%;

    .header-select-label {
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 4px;
    }
}

#troops-counter-content {
    margin-top: 1.5em;
}
</style>