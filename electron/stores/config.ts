import { app } from 'electron';
import { ref, type Mechanus } from 'mechanus';
import { booleanRef } from '$electron/utils/mechanus';
import type { MechanusAppGeneralConfigStoreType, MechanusAppNotificationsConfigStoreType } from '$types/stores';

export function defineAppGeneralConfigStore(mechanus: Mechanus) {
    return mechanus.define('appGeneralConfig', {
        reloadAfterCaptcha: ref<boolean>(true, booleanRef)
    } satisfies MechanusAppGeneralConfigStoreType);
};

export function defineAppNotificationsStore(mechanus: Mechanus) {
    const isAlpha = app.getVersion().includes('alpha');
    const isDev = process.env.ARES_MODE === 'dev';

    return mechanus.define('appNotifications', {
        notifyOnError: ref<boolean>(isAlpha || isDev, booleanRef)
    } satisfies MechanusAppNotificationsConfigStoreType);
};