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
    const coins = ref<number>(0);

    function raw() {
        return {
            active: active.value,
            mode: mode.value,
            delay: delay.value,
            timeUnit: timeUnit.value,
            village: village.value,
            group: group.value,
            coins: coins.value
        };
    };

    return {
        active,
        mode,
        delay,
        timeUnit,
        village,
        group,
        coins,

        raw
    } satisfies PiniaSnobConfigStoreType;
});