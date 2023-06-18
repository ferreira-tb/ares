import { ipcMain, webContents } from 'electron';
import { ref, storeToRefs, watchImmediate } from 'mechanus';
import { sequelize } from '$electron/database';
import { useCacheStore } from '$electron/stores';
import { VillageGroups } from '$electron/database/models';
import { MainProcessError } from '$electron/error';
import { TribalWorker } from '$electron/worker';
import { BrowserTab } from '$electron/tabs';
import { useDelay } from '$electron/composables';
import { GameSearchParams, TribalWorkerName } from '$common/constants';
import { decodeString } from '$common/helpers';
import { isUserAlias } from '$common/guards';

export function setGroupsEvents() {
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    const allGroups = ref<Set<VillageGroup>>(new Set());
    const updateGroups = createGroupsUpdater(userAlias, allGroups);

    ipcMain.handle('game:create-static-group', async (_e, groupName: string): Promise<VillageGroup | null> => {
        try {
            const alias = userAlias.value;
            if (!isUserAlias(alias)) return null;

            await createStaticGroup(groupName);

            // Atualiza os grupos de aldeias após a criação do novo.
            const groups = await fetchGroups();
            await updateGroups(alias, groups);

            const newGroup = Array.from(groups).find((group) => decodeString(group.name) === groupName);
            return newGroup ?? null;

        } catch (err) {
            MainProcessError.catch(err);
            return null;
        };
    });

    ipcMain.handle('game:add-villages-to-group', async (_e, group: number, villages: number[]): Promise<boolean> => {
        try {
            await addVillagesToGroup(group, villages);
            return true;
        } catch (err) {
            MainProcessError.catch(err);
            return false;
        };
    });

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
            MainProcessError.catch(err);
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
            MainProcessError.catch(err);
        };
    });
};

function fetchGroups() {
    return new Promise<Set<VillageGroup>>((resolve, reject) => {
        // Cria o Worker na tela de grupos manuais.
        // Lá é possível obter tanto os grupos manuais quanto os dinâmicos.
        const url = BrowserTab.createURL(GameSearchParams.StaticGroups);
        const worker = new TribalWorker(TribalWorkerName.GetVillageGroups, url);
        worker.once('destroyed', reject);
        worker.once('port:message', (message: Set<VillageGroup> | null) => {
            try {
                if (!message) throw new Error('Could not fetch village groups.');
                resolve(message);
            } catch (err) {
                reject(err);
            } finally {
                worker.destroy();
            };
        });

        worker.init().catch(reject);
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

function createStaticGroup(groupName: string) {
    const delay = useDelay(); 
    return new Promise<void>(async (resolve, reject) => {
        const url = BrowserTab.createURL(GameSearchParams.StaticGroups);
        const worker = new TribalWorker(TribalWorkerName.CreateStaticGroup, url);
        worker.once('destroyed', reject);
        worker.once('port:message', (message) => {
            if (message === 'destroy') {
                resolve();
                setTimeout(() => worker.destroy(), delay.value);
            };
        });

        await worker.init();
        worker.port.postMessage(groupName);
    });
};

function addVillagesToGroup(group: number, villages: number[]) {
    const delay = useDelay(); 
    return new Promise<void>(async (resolve, reject) => {
        const url = BrowserTab.createURL(GameSearchParams.AddVillagesToGroup);
        const worker = new TribalWorker(TribalWorkerName.AddVillagesToGroup, url);
        worker.once('destroyed', reject);
        worker.once('port:message', (message) => {
            if (message === 'destroy') {
                resolve();
                setTimeout(() => worker.destroy(), delay.value);
            };
        });

        await worker.init();
        worker.port.postMessage({ group, villages });
    });
};