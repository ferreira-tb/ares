import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { sequelize } from '$database/database';
import { useCacheStore, useGroupsStore, VillageGroups } from '$interface/index';
import { MainProcessEventError } from '$electron/error';
import { fetchVillageGroups, patchVillageGroups } from '$electron/utils/groups';

export function setGroupsEvents() {
    const cacheStore = useCacheStore();
    const groupsStore = useGroupsStore();
    const { all } = storeToRefs(groupsStore);

    ipcMain.handle('get-village-groups', () => groupsStore.all);

    ipcMain.handle('fetch-village-groups', async () => {
        try {
            if (!cacheStore.userAlias) return false;
            const userAlias = cacheStore.userAlias;
            
            const groups = await fetchVillageGroups();
            patchVillageGroups(groups, all);

            await sequelize.transaction(async (transaction) => {
                await VillageGroups.upsert({
                    id: userAlias,
                    allGroups: [...groups]
                }, { transaction });
            });

            return true;
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });
};