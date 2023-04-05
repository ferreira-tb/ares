import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { isUserAlias } from '$electron/utils/guards';
import { showErrorLog, showDemolitionConfig, showCustomPlunderTemplate } from '$electron/app/modules';
import type { UserAlias } from '$types/electron';
import type { CustomPlunderTemplateType, DemolitionTemplateType } from '$types/plunder';

import {
    useCacheStore,
    usePlunderCacheStore,
    useBrowserViewStore,
    DemolitionTemplate,
    CustomPlunderTemplate
} from '$electron/interface';

export function setModuleEvents() {
    const cacheStore = useCacheStore();
    const plunderCacheStore = usePlunderCacheStore();
    const browserViewStore = useBrowserViewStore();

    const { demolitionTroops } = storeToRefs(plunderCacheStore);
    const { allWebContents } = storeToRefs(browserViewStore);

    // INICIALIZAÇÃO
    ipcMain.on('open-error-log-window', () => showErrorLog());
    ipcMain.on('open-demolition-troops-config-window', () => showDemolitionConfig());
    ipcMain.on('open-custom-plunder-template-window', () => showCustomPlunderTemplate());

    // OUTROS
    // Demolição.
    ipcMain.handle('get-demolition-troops-config', async (_e, alias: UserAlias | null): Promise<DemolitionTemplateType | null> => {
        alias ??= cacheStore.userAlias;
        if (!isUserAlias(alias)) return null;

        if (!demolitionTroops.value || demolitionTroops.value.alias !== alias) {
            const troops = await DemolitionTemplate.getDemolitionTroopsConfig(alias);
            if (alias === cacheStore.userAlias) {
                // eslint-disable-next-line require-atomic-updates
                demolitionTroops.value = troops;
            };
        };

        return demolitionTroops.value;
    });

    ipcMain.handle('save-demolition-troops-config', async (_e, template: DemolitionTemplateType): Promise<boolean> => {
        const saved = await DemolitionTemplate.saveDemolitionTroopsConfig(template);
        if (saved && template.alias === cacheStore.userAlias) {
            demolitionTroops.value = template;
        };
        return saved;
    });

    ipcMain.handle('destroy-demolition-troops-config', async (_e, alias: UserAlias): Promise<boolean> => {
        const destroyed = await DemolitionTemplate.destroyDemolitionTroopsConfig(alias);
        if (destroyed && alias === cacheStore.userAlias) {
            demolitionTroops.value = null;
        };
        return destroyed;
    });

    // Modelos do Plunder.
    ipcMain.handle('get-custom-plunder-templates', async (_e, alias: UserAlias | null): Promise<CustomPlunderTemplateType[] | null> => {
        alias ??= cacheStore.userAlias;
        if (!isUserAlias(alias)) return null;
        const customPlunderTemplates = await CustomPlunderTemplate.getCustomPlunderTemplates(alias);
        if (!Array.isArray(customPlunderTemplates)) return null;
        return customPlunderTemplates;
    });

    ipcMain.handle('save-custom-plunder-template', async (e, template: CustomPlunderTemplateType): Promise<boolean> => {
        const saved = await CustomPlunderTemplate.saveCustomPlunderTemplate(template);
        
        // Se o template foi salvo com sucesso, notifica o browser.
        if (saved) {
            for (const contents of allWebContents.value) {
                if (contents === e.sender) continue;
                contents.send('custom-plunder-template-saved', template);
            };
        };

        return saved;
    });

    ipcMain.handle('destroy-custom-plunder-template', async (e, template: CustomPlunderTemplateType): Promise<boolean> => {
        const destroyed = await CustomPlunderTemplate.destroyCustomPlunderTemplate(template);

        // Se o template foi excluído com sucesso, notifica o browser.
        if (destroyed) {
            for (const contents of allWebContents.value) {
                if (contents === e.sender) continue;
                contents.send('custom-plunder-template-destroyed', template);
            };
        };

        return destroyed;
    });
};