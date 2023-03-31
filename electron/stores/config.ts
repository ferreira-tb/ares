import { ref, type Mechanus } from 'mechanus';
import { booleanRef } from '$electron/utils/mechanus';
import type { MechanusAppGeneralConfigStoreType } from '$types/stores';

export function defineAppGeneralConfigStore(mechanus: Mechanus) {
    return mechanus.define('appGeneralConfig', {
        reloadAfterCaptcha: ref<boolean>(true, booleanRef)
    } satisfies MechanusAppGeneralConfigStoreType);
};