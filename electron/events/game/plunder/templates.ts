import { ipcMain, webContents } from 'electron';
import { StandardWindow } from '$electron/windows';
import { useCacheStore } from '$electron/stores';
import { CustomPlunderTemplate } from '$electron/database/models';
import { StandardWindowName } from '$common/enum';
import { isUserAlias } from '$common/guards';

export function setPlunderTemplatesEvents() {
    const cacheStore = useCacheStore();

    ipcMain.on('plunder:open-custom-template-window', () => {
        StandardWindow.open(StandardWindowName.PlunderTemplate);
    });

    ipcMain.handle('plunder:get-custom-templates', async (_e, alias: UserAlias | null): Promise<CustomPlunderTemplateType[] | null> => {
        alias ??= cacheStore.userAlias;
        if (!isUserAlias(alias)) return null;
        const customPlunderTemplates = await CustomPlunderTemplate.getCustomPlunderTemplates(alias);
        if (!Array.isArray(customPlunderTemplates)) return null;
        return customPlunderTemplates;
    });

    ipcMain.handle('plunder:save-custom-template', async (e, template: CustomPlunderTemplateType): Promise<boolean> => {
        const saved = await CustomPlunderTemplate.saveCustomPlunderTemplate(template);
        
        // Se o template foi salvo com sucesso, notifica o browser.
        if (saved) {
            for (const contents of webContents.getAllWebContents()) {
                if (contents === e.sender) continue;
                contents.send('custom-plunder-template-saved', template);
            }
        }

        return saved;
    });

    ipcMain.handle('plunder:destroy-custom-template', async (e, template: CustomPlunderTemplateType): Promise<boolean> => {
        const destroyed = await CustomPlunderTemplate.destroyCustomPlunderTemplate(template);

        // Se o template foi excluído com sucesso, notifica o browser.
        if (destroyed) {
            for (const contents of webContents.getAllWebContents()) {
                if (contents === e.sender) continue;
                contents.send('custom-plunder-template-destroyed', template);
            }
        }

        return destroyed;
    });
}