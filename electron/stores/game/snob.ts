import { ref } from 'mechanus';

export function defineSnobConfigStore(mechanus: Mechanus) {
    return mechanus.define('snob-config', {
        active: ref<boolean>(false),
        mode: ref<'group' | 'single'>('single'),
        village: ref<number | null>(null),
        group: ref<number>(0),
        coins: ref<number>(0)
    } satisfies MechanusSnobConfigStoreType);
};