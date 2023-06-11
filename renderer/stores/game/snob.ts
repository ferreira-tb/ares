import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Kronos } from '@tb-dev/kronos';

export const useSnobConfigStore = defineStore('snob-config', () => {
    const active = ref<boolean>(false);
    const mode = ref<'group' | 'single'>('single');
    const delay = ref<number>(Kronos.Minute * 5);
    const timeUnit = ref<'hours' | 'minutes' | 'seconds'>('minutes');
    const village = ref<number | null>(null);
    const group = ref<number>(0);

    function raw() {
        return {
            active: active.value,
            mode: mode.value,
            delay: delay.value,
            timeUnit: timeUnit.value,
            village: village.value,
            group: group.value
        };
    };

    return {
        active,
        mode,
        delay,
        timeUnit,
        village,
        group,

        raw
    } satisfies PiniaSnobConfigStoreType;
});

export const useSnobHistoryStore = defineStore('snob-history', () => {
    const coins = ref<number>(0);

    return {
        coins
    } satisfies PiniaSnobHistoryStoreType;
});