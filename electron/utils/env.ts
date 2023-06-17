import { app } from 'electron';
import { storeToRefs, watchImmediate } from 'mechanus';
import { useGameDataStore } from '$electron/stores';

/** Define as variáveis de ambiente. */
export function setEnv() {
    process.env.ARES_MODE = 'dev';
    process.env.ARES_VERSION = app.getVersion();
    process.env.CHROME_VERSION = process.versions.chrome;
    process.env.ELECTRON_VERSION = process.versions.electron;
    process.env.USER_DATA_PATH = app.getPath('userData');

    const gameData = useGameDataStore();
    const { locale, majorVersion } = storeToRefs(gameData);

    watchImmediate(locale, (value) => (process.env.TRIBAL_WARS_LOCALE = value ?? 'unknown'));
    watchImmediate(majorVersion, (value) => (process.env.TRIBAL_WARS_VERSION = value ?? 'unknown'));
};