import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { World } from '$types/game.js';
import type { PiniaAresStoreType } from '$types/stores.js';

/** `null` indica que o usuário se encontra numa página a partir da qual não é possível obter essas informações. */
export const useAresStore = defineStore('ares', () => {
    const locale = ref<string | null>(null);
    const world = ref<World | null>(null);
    const majorVersion = ref<string | null>(null);
    const groupId = ref<number | null>(null);

    const screen = ref<string | null>(null);
    const screenMode = ref<string | null>(null);
    const pregame = ref<boolean | null>(null);

    return {
        locale,
        world,
        majorVersion,
        groupId,
        screen,
        screenMode,
        pregame,
    } satisfies PiniaAresStoreType;
});