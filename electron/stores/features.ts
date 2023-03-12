import { ref, type Mechanus } from 'mechanus';
import { booleanOrNullRef } from '$electron/utils/mechanus';
import { MechanusFeaturesStoreType } from '$types/stores';

export function defineFeaturesStore(mechanus: Mechanus) {
    return mechanus.define('features', {
        premium: ref<boolean | null>(null, booleanOrNullRef),
        accountManager: ref<boolean | null>(null, booleanOrNullRef),
        farmAssistant: ref<boolean | null>(null, booleanOrNullRef)
    } satisfies MechanusFeaturesStoreType);
};