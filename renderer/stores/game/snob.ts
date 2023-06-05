import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSnobConfigStore = defineStore('snob-config', () => {
    const active = ref<boolean>(false);
    const mode = ref<'group' | 'single'>('single');
    const village = ref<number | null>(null);
    const group = ref<number | null>(null);

    return {
        active,
        mode,
        village,
        group
    };
});