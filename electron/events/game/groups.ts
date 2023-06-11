import { URL } from 'node:url';
import { ipcMain, webContents } from 'electron';
import { ref, storeToRefs, watchImmediate } from 'mechanus';
import { sequelize } from '$electron/database';
import { useCacheStore, VillageGroups } from '$electron/interface';
import { MainProcessEventError } from '$electron/error';
import { TribalWorker } from '$electron/worker';
import { getMainViewWebContents } from '$electron/utils/view';
import { GameSearchParams, TribalWorkerName } from '$common/constants';
import { isUserAlias } from '$common/guards';

export function setGroupsEvents() {
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    const allGroups = ref<Set<VillageGroup>>(new Set());
    const updateGroups = createGroupsUpdater(userAlias, allGroups);

    // Retorna informações sobre todos os grupos de aldeias.
    ipcMain.handle('game:get-all-village-groups', (): Set<VillageGroup> => allGroups.value);

    ipcMain.handle('game:fetch-village-groups', async (): Promise<boolean> => {
        try {
            const alias = userAlias.value;
            if (!isUserAlias(alias)) return false;
            
            const groups = await fetchGroups();
            await updateGroups(alias, groups);
            return true;
            
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    watchImmediate(userAlias, async (newAlias) => {
        if (!isUserAlias(newAlias)) {
            allGroups.value.clear();
            patchAllWebContents(allGroups.value);
            return;
        };

        try {
            // Obtém os grupos do banco de dados.
            const previous = (await VillageGroups.findByPk(newAlias))?.allGroups ?? [];
            const newGroups = previous.length > 0 ? new Set(previous) : await fetchGroups();
            await updateGroups(newAlias, newGroups);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};

function fetchGroups(): Promise<Set<VillageGroup>> {
    return new Promise(async (resolve, reject) => {
        // Cria o Worker na tela de grupos manuais.
        // Lá é possível obter tanto os grupos manuais quanto os dinâmicos.
        const mainViewWebContents = getMainViewWebContents();
        const url = new URL(mainViewWebContents.getURL());
        url.search = GameSearchParams.Groups;

        const worker = new TribalWorker(TribalWorkerName.GetVillageGroups, url);
        await worker.init((e) => {
            try {
                if (!(e.data instanceof Set)) {
                    throw new Error('Village groups data must be a Set.');
                };
                resolve(e.data);
            } catch (err) {
                reject(err);
            } finally {
                worker.destroy();
            };
        });
    });
};

function patchAllWebContents(groups: Set<VillageGroup>) {
    for (const contents of webContents.getAllWebContents()) {
        contents.send('game:did-update-village-groups-set', groups);
    };
};

function createGroupsUpdater(
    userAlias: MechanusComputedRef<UserAlias | null>,
    allGroups: MechanusRef<Set<VillageGroup>>
) {
    return async function(alias: UserAlias, groups: Set<VillageGroup>) {
        await sequelize.transaction(async () => {
            await VillageGroups.upsert({ id: alias, allGroups: [...groups] });
        });

        // Garante que o alias ainda é o mesmo.
        if (alias === userAlias.value) {
            patchAllWebContents(groups);
            allGroups.value = groups;
        };
    };
};