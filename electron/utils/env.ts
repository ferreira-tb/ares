import { app } from 'electron';
import { storeToRefs, watchImmediate } from 'mechanus';
import { useAresStore } from '$electron/stores';

/** Define as variáveis de ambiente. */
export function setEnv() {
    process.env.ARES_MODE = 'dev';
    process.env.ARES_VERSION = app.getVersion();
    process.env.CHROME_VERSION = process.versions.chrome;
    process.env.ELECTRON_VERSION = process.versions.electron;
    process.env.USER_DATA_PATH = app.getPath('userData');

    const aresStore = useAresStore();
    const { locale, majorVersion } = storeToRefs(aresStore);

    watchImmediate(locale, (value) => (process.env.TRIBAL_WARS_LOCALE = value ?? 'unknown'));
    watchImmediate(majorVersion, (value) => (process.env.TRIBAL_WARS_VERSION = value ?? 'unknown'));
};