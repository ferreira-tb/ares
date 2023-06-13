import { ref } from 'mechanus';

export function defineFeaturesStore(mechanus: Mechanus) {
    return mechanus.define('features', () => {
        const premium = ref<boolean | null>(null);
        const accountManager = ref<boolean | null>(null);
        const farmAssistant = ref<boolean | null>(null);

        return {
            premium,
            accountManager,
            farmAssistant
        } satisfies MechanusFeaturesStoreType;
    });
};