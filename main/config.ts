import Store from 'electron-store';
import { ipcMain } from 'electron';
import type { Schema } from 'electron-store';

const falseDefault: Record<string, unknown> = {
    type: 'boolean',
    default: false
};

const configSchema: Schema<Record<string, unknown>> = {
    'plunder-state': {
        type: 'object',
        properties: {
            status: falseDefault,
            ignoreWall: falseDefault,
            destroyWall: falseDefault,
            groupAttack: falseDefault,
            useCModel: falseDefault,
            ignoreDelay: falseDefault
        }
    }
};

const configStore = new Store({
    schema: configSchema
});

ipcMain.handle('is-plunder-active', () => configStore.get('plunder-state.status', false));
ipcMain.handle('get-plunder-state', () => configStore.get('plunder-state', null));
ipcMain.handle('set-plunder-state', (_e, name: string, state: unknown) => {
    try {
        configStore.set(`plunder-state.${name}`, state);
        return true;
    } catch (err) {
        if (err instanceof Error) return err.message;
    };

    return false;
});