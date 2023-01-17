import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ipcInvoke } from '@/ipc.js';
import { usePlunderStore } from '@/stores/plunder.js';
import { ClaustrophobicError } from '@/error.js';
import { gameURL } from '@/constants.js';

export const usePhobiaStore = defineStore('phobia', () => {
    /** URL da página atual. */
    const currentURL = ref<string>(gameURL);

    return {
        currentURL
    };
});

export async function setSavedState() {
    try {
        const plunderStore = usePlunderStore();
        const plunderState = await ipcInvoke('get-plunder-state');
        if (plunderState) plunderStore.$patch({ ...plunderState });

    } catch (err) {
        ClaustrophobicError.handle(err)
    };
};