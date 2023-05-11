import { app } from 'electron';
import { ref } from 'mechanus';
import { booleanRef } from '$electron/utils/mechanus';

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