import { app } from 'electron';
import { storeToRefs, watch } from 'mechanus';
import { useAresStore } from '$electron/interface';

/** Define as variáveis de ambiente. */
export function setEnv() {
    process.env.ARES_MODE = 'dev';
    process.env.ARES_VERSION = app.getVersion();
    process.env.CHROME_VERSION = process.versions.chrome;
    process.env.ELECTRON_VERSION = process.versions.electron;
    process.env.USER_DATA_PATH = app.getPath('userData');

    const aresStore = useAresStore();
    const { locale, majorVersion } = storeToRefs(aresStore);

    watch(locale, (value) => (process.env.TRIBAL_WARS_LOCALE = value ?? 'unknown'));
    watch(majorVersion, (value) => (process.env.TRIBAL_WARS_VERSION = value ?? 'unknown'));
};