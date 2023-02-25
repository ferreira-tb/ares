import { ipcMain } from 'electron';
import { isObject } from '@tb-dev/ts-guard';
import { isUserAlias } from '$electron/utils/guards.js';
import { showErrorLog, showDemolitionConfig, showAppConfig } from '$electron/app/modules.js';
import { cacheProxy, UserConfig } from '$interface/index.js';
import type { UserAlias } from '$types/electron.js';
import type { UnitsToDestroyWall } from '$types/game.js';

export function setModuleEvents() {
    // Abertura de módulos.
    ipcMain.on('open-error-log-window', () => showErrorLog());
    ipcMain.on('open-demolition-troops-config-window', () => showDemolitionConfig());
    ipcMain.on('open-plunder-config-window', () => showAppConfig('plunder-config'));

    // Outros.
    ipcMain.handle('get-demolition-troops-config', async () => {
        if (!isUserAlias(cacheProxy.userAlias)) return null;
        const demolitionTroops = await UserConfig.getDemolitionTroopsConfig(cacheProxy.userAlias);
        if (!isObject(demolitionTroops)) return null;
        return demolitionTroops;
    });

    ipcMain.on('save-demolition-troops-config', async (_e, userAlias: UserAlias, unitsToDestroyWall: UnitsToDestroyWall) => {
        await UserConfig.saveDemolitionTroopsConfig(userAlias, unitsToDestroyWall);
    });

    ipcMain.handle('destroy-demolition-troops-config', async (_e, userAlias: UserAlias): Promise<boolean> => {
        return await UserConfig.destroyDemolitionTroopsConfig(userAlias);
    });
};