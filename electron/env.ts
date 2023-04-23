import { app } from 'electron';

/** Define as variáveis de ambiente. */
export function setEnv() {
    process.env.ARES_MODE = 'dev';
    process.env.ARES_VERSION = app.getVersion();
    process.env.ELECTRON_VERSION = process.versions.electron;
    process.env.USER_DATA_PATH = app.getPath('userData');
};