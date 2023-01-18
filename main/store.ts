import Store from 'electron-store';
import { ipcMain } from 'electron';
import type { Schema } from 'electron-store';
import type { PlunderState, PlunderStateValue } from '@/stores/plunder.js';

const falseDefault: Record<string, unknown> = {
    type: 'boolean',
    default: false
};

const plunderSchema: Schema<Record<string, unknown>> = {
    'plunder-state': {
        type: 'object',
        properties: {
            status: falseDefault,
            ignoreWall: falseDefault,
            destroyWall: falseDefault,
            groupAttack: falseDefault,
            useCModel: falseDefault,
            ignoreDelay: falseDefault,
            blindAttack: falseDefault
        }
    }
};

const plunderStore = new Store({
    name: 'plunder',
    schema: plunderSchema
});

ipcMain.handle('is-plunder-active', () => plunderStore.get('plunder-state.status', false));
ipcMain.handle('get-plunder-state', () => plunderStore.get('plunder-state', null));
ipcMain.handle('set-plunder-state', (_e, name: keyof PlunderState, state: PlunderStateValue) => {
    try {
        plunderStore.set(`plunder-state.${name}`, state);
        return true;
    } catch (err) {
        if (err instanceof Error) return err.message;
    };

    return false;
});