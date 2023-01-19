import { defineStore } from 'pinia';
import { ref } from 'vue';
import { patchPlunderStore } from '@/stores/plunder.js';
import { ClaustrophobicError } from '@/error.js';
import { gameURL } from '@/constants.js';

export const usePhobiaStore = defineStore('phobia', () => {
    /** URL da página atual. */
    const currentURL = ref<string>(gameURL);

    return { currentURL };
});

export async function setSavedState() {
    try {
        await patchPlunderStore();

    } catch (err) {
        ClaustrophobicError.handle(err)
    };
};