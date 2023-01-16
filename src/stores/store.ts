import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePhobiaStore = defineStore('phobia', () => {
    /** URL da página atual. */
    const currentURL = ref<string>('https://www.tribalwars.com.br/');

    return {
        currentURL
    };
});