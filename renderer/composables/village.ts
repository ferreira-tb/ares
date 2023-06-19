import { computed, readonly, ref, toRef, toValue, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { ipcInvoke } from '$renderer/ipc';
import { useGameDataStore } from '$renderer/stores';
import { decodeVillage } from '$common/utils';
import type { MaybeRefOrGetter } from 'vue';

export function useVillage(villageId: MaybeRefOrGetter<number | null>) {
    const village = ref<WorldVillageType | null>(null);
    const villageIdRef = toRef(villageId);

    watchEffect(async () => {
        const id = toValue(villageIdRef);
        if (id) {
            const raw = await ipcInvoke('world-data:get-village', id);
            if (raw.length === 0) village.value = null;
            else village.value = decodeVillage(raw[0]);
        } else {
            village.value = null;
        };
    });

    return readonly(village);
};

export function useAllyVillages(allyId: MaybeRefOrGetter<number | number[] | null>) {
    const villages = ref<WorldVillageType[]>([]);
    const allyIdRef = toRef(allyId);

    const idList = computed(() => {
        if (!allyIdRef.value) return [];
        return Array.isArray(allyIdRef.value) ? allyIdRef.value : [allyIdRef.value];
    });

    watchEffect(async () => {
        const ids = toValue(idList);
        if (ids.length === 0) {
            villages.value = [];
        } else {
            const raw = await ipcInvoke('world-data:get-ally-villages', ids);
            villages.value = raw.map(decodeVillage);
        };
    });

    return readonly(villages);
};

export function usePlayerVillages(playerId: MaybeRefOrGetter<number | number[] | null>) {
    const villages = ref<WorldVillageType[]>([]);
    const playerIdRef = toRef(playerId);

    const idList = computed(() => {
        if (!playerIdRef.value) return [];
        return Array.isArray(playerIdRef.value) ? playerIdRef.value : [playerIdRef.value];
    });

    watchEffect(async () => {
        const ids = toValue(idList);
        if (ids.length === 0) {
            villages.value = [];
        } else {
            const raw = await ipcInvoke('world-data:get-player-villages', ids);
            villages.value = raw.map(decodeVillage);
        };
    });

    return readonly(villages);
};

export function useWorldVillages() {
    const gameDataStore = useGameDataStore();
    const { world } = storeToRefs(gameDataStore);

    const villages = ref<WorldVillageType[]>([]);

    watchEffect(async () => {
        const currentWorld = toValue(world);
        if (currentWorld) {
            const raw = await ipcInvoke('world-data:get-village', null, currentWorld);
            villages.value = raw.map(decodeVillage);  
        } else {
            villages.value = [];
        };
    });

    return readonly(villages);
};