import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { StandardWindow } from '$electron/windows';
import { isUserAlias } from '$common/guards';
import { useCacheStore, usePlunderCacheStore } from '$electron/stores';
import { DemolitionTemplate } from '$electron/database/models';
import { StandardWindowName } from '$common/constants';

export function setPlunderDemolitionEvents() {
    const cacheStore = useCacheStore();
    const plunderCacheStore = usePlunderCacheStore();
    const { demolitionTroops } = storeToRefs(plunderCacheStore);

    ipcMain.on('plunder:open-demolition-config-window', () => {
        StandardWindow.open(StandardWindowName.DemolitionTemplate);
    });

    ipcMain.handle('plunder:get-demolition-config', async (_e, alias: UserAlias | null): Promise<DemolitionTemplateType | null> => {
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

    ipcMain.handle('plunder:save-demolition-config', async (_e, template: DemolitionTemplateType): Promise<boolean> => {
        const saved = await DemolitionTemplate.saveDemolitionTroopsConfig(template);
        if (saved && template.alias === cacheStore.userAlias) {
            demolitionTroops.value = template;
        };
        return saved;
    });

    ipcMain.handle('plunder:destroy-demolition-config', async (_e, alias: UserAlias): Promise<boolean> => {
        const destroyed = await DemolitionTemplate.destroyDemolitionTroopsConfig(alias);
        if (destroyed && alias === cacheStore.userAlias) {
            demolitionTroops.value = null;
        };
        return destroyed;
    });
};