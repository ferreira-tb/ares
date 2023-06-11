import { ref } from 'mechanus';

export function defineFeaturesStore(mechanus: Mechanus) {
    return mechanus.define('features', {
        premium: ref<boolean | null>(null),
        accountManager: ref<boolean | null>(null),
        farmAssistant: ref<boolean | null>(null)
    } satisfies MechanusFeaturesStoreType);
};