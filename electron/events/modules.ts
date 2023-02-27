import { ipcMain } from 'electron';
import { isObject } from '@tb-dev/ts-guard';
import { isUserAlias } from '$electron/utils/guards.js';
import { getMainWindow } from '$electron/utils/helpers.js';
import { cacheProxy, DemolitionTemplate, CustomPlunderTemplate } from '$interface/index.js';
import type { UserAlias } from '$types/electron.js';
import type { CustomPlunderTemplateType, DemolitionTemplateType } from '$types/plunder.js';

import {
    showErrorLog,
    showDemolitionConfig,
    showAppConfig,
    showCustomPlunderTemplate
} from '$electron/app/modules.js';

export function setModuleEvents() {
    //////// INICIALIZAÇÃO
    ipcMain.on('open-error-log-window', () => showErrorLog());
    ipcMain.on('open-demolition-troops-config-window', () => showDemolitionConfig());
    ipcMain.on('open-plunder-config-window', () => showAppConfig('plunder-config'));
    ipcMain.on('open-custom-plunder-template-window', () => showCustomPlunderTemplate());

    //////// OUTROS
    // Demolição.
    ipcMain.handle('get-demolition-troops-config', async (_e, alias: UserAlias | null): Promise<DemolitionTemplateType | null> => {
        alias ??= cacheProxy.userAlias;
        if (!isUserAlias(alias)) return null;

        let demolitionTroops: DemolitionTemplateType | null = cacheProxy.demolitionTroops;
        if (!isObject(demolitionTroops) || demolitionTroops.alias !== alias) {
            demolitionTroops = await DemolitionTemplate.getDemolitionTroopsConfig(alias);
            if (alias === cacheProxy.userAlias) cacheProxy.demolitionTroops = demolitionTroops;
        };
        
        return demolitionTroops;
    });

    ipcMain.handle('save-demolition-troops-config', async (_e, template: DemolitionTemplateType): Promise<boolean> => {
        const status = await DemolitionTemplate.saveDemolitionTroopsConfig(template);
        if (status === true && template.alias === cacheProxy.userAlias) cacheProxy.demolitionTroops = template;
        return status;
    });

    ipcMain.handle('destroy-demolition-troops-config', async (_e, alias: UserAlias): Promise<boolean> => {
        const status = await DemolitionTemplate.destroyDemolitionTroopsConfig(alias);
        if (status === true && alias === cacheProxy.userAlias) cacheProxy.demolitionTroops = null;
        return status;
    });

    // Modelos do Plunder.
    ipcMain.handle('get-custom-plunder-template', async (_e, alias: UserAlias | null): Promise<CustomPlunderTemplateType[] | null> => {
        alias ??= cacheProxy.userAlias;
        if (!isUserAlias(alias)) return null;
        const customPlunderTemplates = await CustomPlunderTemplate.getCustomPlunderTemplates(alias);
        if (!Array.isArray(customPlunderTemplates)) return null;
        return customPlunderTemplates;
    });

    ipcMain.handle('save-custom-plunder-template', async (_e, template: CustomPlunderTemplateType): Promise<boolean> => {
        const status = await CustomPlunderTemplate.saveCustomPlunderTemplate(template);
        
        // Se o template foi salvo com sucesso, notifica o browser.
        if (status === true) {
            const mainWindow = getMainWindow();
            mainWindow.webContents.send('custom-plunder-template-saved', template);
        };

        return status;
    });

    ipcMain.handle('destroy-custom-plunder-template', async (_e, template: CustomPlunderTemplateType): Promise<boolean> => {
        const status = await CustomPlunderTemplate.destroyCustomPlunderTemplate(template);

        // Se o template foi excluído com sucesso, notifica o browser.
        if (status === true) {
            const mainWindow = getMainWindow();
            mainWindow.webContents.send('custom-plunder-template-destroyed', template);
        };

        return status;
    });
};