import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { showDemolitionConfig } from '$electron/app/modules';
import { isUserAlias } from '$electron/utils/guards';
import { useCacheStore, usePlunderCacheStore, DemolitionTemplate } from '$electron/interface';
import type { UserAlias } from '$types/electron';
import type { DemolitionTemplateType } from '$types/plunder';

export function setDemolitionModuleEvents() {
    const cacheStore = useCacheStore();
    const plunderCacheStore = usePlunderCacheStore();
    const { demolitionTroops } = storeToRefs(plunderCacheStore);

    ipcMain.on('open-demolition-troops-config-window', () => showDemolitionConfig());

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
};