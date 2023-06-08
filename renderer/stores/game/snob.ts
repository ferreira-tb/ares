import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSnobConfigStore = defineStore('snob-config', () => {
    const active = ref<boolean>(false);
    const mode = ref<'group' | 'single'>('single');
    const village = ref<number | null>(null);
    const group = ref<number>(0);

    function raw() {
        return {
            active: active.value,
            mode: mode.value,
            village: village.value,
            group: group.value
        };
    };

    return {
        active,
        mode,
        village,
        group,

        raw
    } satisfies PiniaSnobConfigStoreType;
});