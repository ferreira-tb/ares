import { URL } from 'url';
import { ipcMain, BrowserWindow } from 'electron';
import { assertObject, assertInteger, isKeyOf, isInteger } from '@tb-dev/ts-guard';
import { storeToRefs } from 'mechanus';
import { assertUserAlias, isUserAlias, isWorld } from '$electron/utils/guards';
import { sequelize } from '$database/database';
import { MainProcessEventError } from '$electron/error';
import { getPanelWindow, extractWorldUnitsFromMap } from '$electron/utils/helpers';
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
    useBrowserViewStore,
    WorldUnit,
    worldUnitsMap
} from '$interface/index';

import type {
    PlunderAttackDetails,
    PlunderConfigKeys,
    PlunderConfigValues,
    PlunderCurrentVillageType
} from '$types/plunder';

export function setPlunderEvents() {
    const panelWindow = getPanelWindow();

    const cacheStore = useCacheStore();
    const plunderStore = usePlunderStore();
    const plunderCacheStore = usePlunderCacheStore();
    const plunderConfigStore = usePlunderConfigStore();
    const lastPlunderHistoryStore = useLastPlunderHistoryStore();
    const totalPlunderHistoryStore = useTotalPlunderHistoryStore();
    const browserViewStore = useBrowserViewStore();

    const { page: currentPage } = storeToRefs(plunderStore);
    const { currentVillage } = storeToRefs(plunderCacheStore);
    const { allWebContents } = storeToRefs(browserViewStore);

    // Verifica se o Plunder está ativo.
    ipcMain.handle('is-plunder-active', () => plunderConfigStore.active);
    
    // Obtém as configurações do Plunder.
    ipcMain.handle('get-plunder-config', () => {
        const alias = cacheStore.userAlias;
        if (isUserAlias(alias)) return { ...plunderConfigStore };
        return null;
    });

    // Recebe as configurações do Plunder do painel ou do módulo de configuração e as salva no banco de dados.
    ipcMain.on('update-plunder-config', async (e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
        try {
            if (!isKeyOf(key, plunderConfigStore)) return;
            const previousValue = Reflect.get(plunderConfigStore, key);
            if (previousValue === value) return;

            // A confirmação dos tipos é feita na store.
            Reflect.set(plunderConfigStore, key, value);

            // Comunica a mudança aos processos diferentes daquele que enviou os dados.
            for (const contents of allWebContents.value) {
                if (contents !== e.sender) {
                    contents.send('plunder-config-updated', key, value);
                };
            };

            for (const browserWindow of BrowserWindow.getAllWindows()) {
                const content = browserWindow.webContents;
                if (content !== e.sender && !allWebContents.value.has(content)) {
                    browserWindow.webContents.send('plunder-config-updated', key, value);
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

    ipcMain.on('update-plunder-current-village-info', (_e, villageInfo: PlunderCurrentVillageType) => {
        if (currentVillage.value && currentVillage.value.id === villageInfo.id) return;
        currentVillage.value = villageInfo;
    });

    // Emitido pela view após cada ataque realizado pelo Plunder.
    ipcMain.on('plunder-attack-sent', (_e, details: PlunderAttackDetails) => {
        try {
            assertObject(details, 'Erro ao atualizar os detalhes do ataque: o objeto é inválido.');
            panelWindow.webContents.send('plunder-attack-sent', details);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Emitido pela view quando o Plunder é desativado.
    ipcMain.on('save-plunder-attack-details', async (_e, details: PlunderAttackDetails) => {
        try {
            assertObject(details, 'Erro ao salvar os detalhes do ataque: o objeto é inválido.');

            for (const [key, value] of Object.entries(details) as [keyof PlunderAttackDetails, number][]) {
                assertInteger(value, 'Erro ao salvar os detalhes do ataque: valor inválido.');
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

    ipcMain.handle('navigate-to-next-plunder-page', async (e) => {
        try {
            if (!currentVillage.value) return false;

            const pages = currentVillage.value.pages.filter(({ done }) => !done);
            let nextPage = pages.find(({ page }) => page > currentPage.value);
            if (!nextPage) nextPage = pages.find(({ page }) => page !== currentPage.value);
            if (!nextPage) return false;
            
            const url = new URL(e.sender.getURL());
            url.searchParams.set('Farm_page', nextPage.page.toString(10));
            queueMicrotask(() => e.sender.loadURL(url.href));
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });
};