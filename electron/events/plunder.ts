import { URL } from 'url';
import { ipcMain, webContents } from 'electron';
import { storeToRefs } from 'mechanus';
import { assertInteger, isKeyOf, isInteger, isPositiveInteger } from '@tb-dev/ts-guard';
import { assertUserAlias, isUserAlias, isWorld } from '$electron/utils/guards';
import { sequelize } from '$electron/database';
import { MainProcessEventError } from '$electron/error';
import { getPanelWindow, extractWorldUnitsFromMap, generateRandomDelay } from '$electron/utils/helpers';
import { plunderSearchParams } from '$electron/utils/constants';
import type { IpcMainEvent } from 'electron';
import type { UnitAmount, World } from '$types/game';
import type { WorldUnitType } from '$types/world';

import {
    PlunderHistory,
    PlunderConfig,
    usePlunderConfigStore,
    useLastPlunderHistoryStore,
    useTotalPlunderHistoryStore,
    useCacheStore,
    usePlunderStore,
    usePlunderCacheStore,
    WorldUnit,
    worldUnitsMap
} from '$interface/index';

import type {
    PlunderAttackDetails,
    PlunderCurrentVillageType,
    PlunderGroupType,
    PlunderGroupVillageType
} from '$types/plunder';

export function setPlunderEvents() {
    const panelWindow = getPanelWindow();

    const cacheStore = useCacheStore();
    const plunderStore = usePlunderStore();
    const plunderCacheStore = usePlunderCacheStore();
    const plunderConfigStore = usePlunderConfigStore();
    const lastPlunderHistoryStore = useLastPlunderHistoryStore();
    const totalPlunderHistoryStore = useTotalPlunderHistoryStore();

    const { page: currentPage } = storeToRefs(plunderStore);
    const { currentVillage, plunderGroup } = storeToRefs(plunderCacheStore);

    // Verifica se o Plunder está ativo.
    ipcMain.handle('is-plunder-active', () => plunderConfigStore.active);
    
    // Obtém as configurações do Plunder.
    ipcMain.handle('get-plunder-config', () => {
        const alias = cacheStore.userAlias;
        if (isUserAlias(alias)) return { ...plunderConfigStore };
        return null;
    });

    // Recebe as configurações do Plunder do painel ou do módulo de configuração e as salva no banco de dados.
    ipcMain.on('update-plunder-config', async <T extends keyof typeof plunderConfigStore>(
        e: IpcMainEvent, key: T, value: typeof plunderConfigStore[T]
    ) => {
        try {
            if (!isKeyOf(key, plunderConfigStore)) return;
            const previousValue = plunderConfigStore[key];
            if (previousValue === value) return;

            // A confirmação dos tipos é feita na store.
            Reflect.set(plunderConfigStore, key, value);

            // Comunica a mudança aos processos diferentes daquele que enviou os dados.
            for (const contents of webContents.getAllWebContents()) {
                if (contents !== e.sender) {
                    contents.send('plunder-config-updated', key, value);
                };
            };

            const userAlias = cacheStore.userAlias;
            assertUserAlias(userAlias, MainProcessEventError);

            await sequelize.transaction(async (transaction) => {
                await PlunderConfig.upsert({ id: userAlias, ...plunderConfigStore }, { transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Armazena informações relevantes sobre a aldeia atual no cache do Plunder.
    // Entre elas estão detalhes sobre as páginas do assistente de saque.
    ipcMain.on('update-plunder-cache-village-info', (_e, villageInfo: PlunderCurrentVillageType | null) => {
        try {
            if (villageInfo && currentVillage.value?.id === villageInfo.id) {
                return;
            };
    
            currentVillage.value = villageInfo;
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Retorna as informações sobre a aldeia atual armazenadas no cache do Plunder.
    ipcMain.handle('get-plunder-cache-village-info', () => currentVillage.value);

    ipcMain.handle('update-plunder-cache-group-info', (_e, groupInfo: PlunderGroupType | null) => {
        try {
            plunderGroup.value = groupInfo;
            return true;
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.handle('get-plunder-cache-group-info', () => plunderGroup.value);

    // Emitido pela view após cada ataque realizado pelo Plunder.
    ipcMain.on('plunder-attack-sent', (_e, details: PlunderAttackDetails) => {
        panelWindow.webContents.send('plunder-attack-sent', details);
    });

    // Emitido pela view quando o Plunder é desativado.
    ipcMain.on('save-plunder-attack-details', async (_e, details: PlunderAttackDetails) => {
        try {
            for (const [key, value] of Object.entries(details) as [keyof PlunderAttackDetails, number][]) {
                assertInteger(value, `Could not save plunder attack details: ${key} is not an integer.`);
                lastPlunderHistoryStore[key] = value;
                totalPlunderHistoryStore[key] += value;
            };

            const userAlias = cacheStore.userAlias;
            assertUserAlias(userAlias, MainProcessEventError);

            await sequelize.transaction(async (transaction) => {
                await PlunderHistory.upsert({
                    id: userAlias,
                    last: { ...lastPlunderHistoryStore },
                    total: { ...totalPlunderHistoryStore }
                }, { transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('get-last-plunder-attack-details', async (): Promise<PlunderAttackDetails | null> => {
        try {
            return (await PlunderHistory.getHistoryAsJSON(cacheStore))?.last ?? null;
        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.handle('get-total-plunder-attack-details', async (): Promise<PlunderAttackDetails | null> => {
        try {
            return (await PlunderHistory.getHistoryAsJSON(cacheStore))?.total ?? null;
        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    // Calcula a capacidade de carga de um determinado conjunto de unidades.
    ipcMain.handle('calc-carry-capacity', async (_e, units: Partial<UnitAmount>, world?: World | null) => {
        try {
            world ??= cacheStore.world;
            if (!isWorld(world)) return null;

            let worldUnits: WorldUnitType;
            if (world === cacheStore.world) {       
                worldUnits = extractWorldUnitsFromMap(worldUnitsMap);
            } else {
                const worldUnitsRow = await WorldUnit.findByPk(world);
                if (!worldUnitsRow) return null;
                worldUnits = worldUnitsRow.toJSON();
            };
            
            const entries = Object.entries(units) as [keyof UnitAmount, number][];
            return entries.reduce((carryCapacity, [unit, amount]) => {
                const unitCapacity = worldUnits[unit]?.carry;
                if (isInteger(unitCapacity)) carryCapacity += unitCapacity * amount;
                return carryCapacity;
            }, 0);

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    // Navega para a próxima página do assistente de saque, se possível for.
    ipcMain.handle('navigate-to-next-plunder-page', async (e) => {
        try {
            if (!currentVillage.value || currentVillage.value.pages.length <= 1) return false;

            const pages = currentVillage.value.pages.filter(({ done }) => !done);
            let nextPage = pages.find(({ page }) => page > currentPage.value);
            if (!nextPage) nextPage = pages.find(({ page }) => page !== currentPage.value);
            if (!nextPage) return false;
            
            const url = new URL(e.sender.getURL());
            url.searchParams.set('Farm_page', nextPage.page.toString(10));

            const delay = generateRandomDelay(plunderConfigStore.pageDelay, 200);
            setTimeout(() => e.sender.loadURL(url.href).catch(MainProcessEventError.catch), delay);
            
            nextPage.done = true;
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    // Navega para a primeira página do assistente de saque.
    ipcMain.handle('navigate-to-first-plunder-page', (e) => {
        try {
            const url = new URL(e.sender.getURL());
            url.search = plunderSearchParams;
            queueMicrotask(() => e.sender.loadURL(url.href).catch(MainProcessEventError.catch));
            return true;
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.handle('navigate-to-next-plunder-village', (e, currentVillageId?: number | null) => {
        try {
            if (!plunderGroup.value) return false;
            let villages = Array.from(plunderGroup.value.villages.entries());

            // Se todas as aldeias do grupo já foram atacadas, avisa a view.
            if (villages.length > 0 && villages.every(([, { done }]) => done)) {
                e.sender.send('plunder-group-is-exhausted');
                return false;
            };

            // Do contrário, remove as aldeias que já atacaram, além da aldeia atual se houver um id válido.
            villages = villages.filter(([, { done }]) => !done);
            if (isPositiveInteger(currentVillageId)) {
                villages = villages.filter(([id]) => id !== currentVillageId);
            };
            
            if (villages.length === 0) return false;

            const nextVillage = villages.reduce((prev, curr) => {
                if (!prev) return curr;
                if (curr[1].waveMaxDistance < prev[1].waveMaxDistance) return curr;
                return prev;
            }, null as [number, PlunderGroupVillageType] | null);

            if (!nextVillage) return false;

            const url = new URL(e.sender.getURL());
            url.search = plunderSearchParams;
            url.searchParams.set('village', nextVillage[0].toString(10));
            url.searchParams.set('group', plunderGroup.value.id.toString(10));
            
            const delay = generateRandomDelay(plunderConfigStore.villageDelay, 200);
            setTimeout(() => e.sender.loadURL(url.href).catch(MainProcessEventError.catch), delay);
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.handle('navigate-to-plunder-group', (e) => {
        try {
            if (!plunderConfigStore.plunderGroupId) return false;

            const url = new URL(e.sender.getURL());
            url.search = plunderSearchParams;
            url.searchParams.set('group', plunderConfigStore.plunderGroupId.toString(10));
            queueMicrotask(() => e.sender.loadURL(url.href).catch(MainProcessEventError.catch));
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });
};