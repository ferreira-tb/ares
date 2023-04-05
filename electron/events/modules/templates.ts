import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { showCustomPlunderTemplate } from '$electron/app/modules';
import { isUserAlias } from '$electron/utils/guards';
import { useCacheStore, useBrowserViewStore, CustomPlunderTemplate } from '$electron/interface';
import type { UserAlias } from '$types/electron';
import type { CustomPlunderTemplateType } from '$types/plunder';

export function setPlunderTemplatesModuleEvents() {
    const cacheStore = useCacheStore();
    const browserViewStore = useBrowserViewStore();
    const { allWebContents } = storeToRefs(browserViewStore);

    ipcMain.on('open-custom-plunder-template-window', () => showCustomPlunderTemplate());

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