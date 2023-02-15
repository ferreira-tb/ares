import { assertStringOrNull, assertIntegerOrNull, isString } from '@tb-dev/ts-guard';
import { assertPanelWindow } from '$electron/utils/helpers.js';
import { MainProcessError } from '$electron/error.js';
import type { BrowserStoreType } from '$types/electron.js';

class BrowserStore implements BrowserStoreType {
    version: string | null = null;
    world: string | null = null;
    player: string | null = null;
    playerId: number | null = null;
    groupId: number | null = null;

    // Features
    premium: boolean | null = null;
    accountManager: boolean | null = null;
    farmAssistant: boolean | null = null;
};

export const browserStore = new Proxy(new BrowserStore(), {
    set(target, prop, value) {
        if (!isString(prop)) return false;

        const panelWindow = assertPanelWindow();

        switch (prop) {
            case 'version':
                assertStringOrNull(value);
                panelWindow.webContents.send('update-current-major-version', value);
                break;
            case 'world':
                assertStringOrNull(value);
                panelWindow.webContents.send('update-current-world', value);
                break;
            case 'player':
                assertStringOrNull(value);
                panelWindow.webContents.send('update-current-player', value);
                break;
            case 'playerId':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-player-id', value);
                break;
            case 'groupId':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-group-id', value);
                break;
            default:
                throw new MainProcessError(`A propriedade ${prop} não é válida para o BrowserStore.`);
        };

        return Reflect.set(target, prop, value);
    }
});