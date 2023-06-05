import { app } from 'electron';
import { ref } from 'mechanus';

export function defineAppGeneralConfigStore(mechanus: Mechanus) {
    return mechanus.define('app-general-config', {
        reloadAfterCaptcha: ref<boolean>(true)
    } satisfies MechanusAppGeneralConfigStoreType);
};

export function defineAppNotificationsStore(mechanus: Mechanus) {
    const isAlpha = app.getVersion().includes('alpha');
    const isDev = process.env.ARES_MODE === 'dev';

    return mechanus.define('app-notifications', {
        notifyOnError: ref<boolean>(isAlpha || isDev)
    } satisfies MechanusAppNotificationsConfigStoreType);
};