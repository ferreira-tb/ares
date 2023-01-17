import Store, { type Schema } from 'electron-store';
import { ipcMain } from 'electron';

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

ipcMain.handle('get-plunder-state', () => configStore.get('plunder-state', null));
ipcMain.handle('set-plunder-state', (_e, name: keyof PlunderState, state: boolean) => {
    try {
        configStore.set(`plunder-state.${name}`, state);
        return true;
    } catch (err) {
        if (err instanceof Error) return err.message;
    };

    return false;
});