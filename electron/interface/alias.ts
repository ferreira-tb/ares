import { storeToRefs } from 'mechanus';
import { getPanelWindow } from '$electron/utils/helpers';
import { isUserAlias } from '$global/guards';
import { Kronos } from '$global/constants';
import { fetchVillageGroups, patchVillageGroups } from '$electron/utils/groups';
import { AliasInterfaceError } from '$electron/error';
import { sequelize } from '$electron/database';
import type { UserAlias } from '$types/electron';
import type { PlunderConfigType, PlunderHistoryType, PlunderHistoryVillageType } from '$types/plunder';
import type { PlunderConfig as PlunderConfigTable, PlunderHistory as PlunderHistoryTable } from '$database/plunder';
import type { VillageGroups as VillageGroupsTable } from '$database/groups';

import type {
    useGroupsStore as useGroupsStoreType,
    usePlunderConfigStore as usePlunderConfigStoreType,
    usePlunderHistoryStore as usePlunderHistoryStoreType
} from '$electron/interface';

/** Entende-se como "alias" o padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`. */
export function onAliasChange(
    PlunderConfig: typeof PlunderConfigTable,
    PlunderHistory: typeof PlunderHistoryTable,
    usePlunderConfigStore: typeof usePlunderConfigStoreType,
    usePlunderHistoryStore: typeof usePlunderHistoryStoreType,

    VillageGroups: typeof VillageGroupsTable,
    useGroupsStore: typeof useGroupsStoreType
) {
    return async function(alias: UserAlias | null) {
        try {
            if (!isUserAlias(alias)) return;
            await Promise.all([
                patchGroups(alias, VillageGroups, useGroupsStore),
                patchPlunderConfig(alias, PlunderConfig, usePlunderConfigStore),
                patchPlunderHistory(alias, PlunderHistory, usePlunderHistoryStore)
            ]);
        } catch (err) {
            AliasInterfaceError.catch(err);
        };
    };
};

async function patchGroups(
    alias: UserAlias,
    VillageGroups: typeof VillageGroupsTable,
    useGroupsStore: typeof useGroupsStoreType
) {
    try {
        const groupsStore = useGroupsStore();
        const { all } = storeToRefs(groupsStore);

        // Obtém os grupos do banco de dados.
        const villageGroups = await VillageGroups.findByPk(alias);
        const groups = new Set(villageGroups?.allGroups ?? []);
        if (groups.size === 0) {
            (await fetchVillageGroups()).forEach((group) => {
                groups.add(group);
            });
        };

        patchVillageGroups(groups, all);
        
        await sequelize.transaction(async (transaction) => {
            await VillageGroups.upsert({
                id: alias, allGroups: [...groups]
            }, { transaction });
        });

    } catch (err) {
        AliasInterfaceError.catch(err);
    };
};

async function patchPlunderConfig<T extends keyof PlunderConfigType>(
    alias: UserAlias,
    PlunderConfig: typeof PlunderConfigTable,
    usePlunderConfigStore: typeof usePlunderConfigStoreType
) {
    const panelWindow = getPanelWindow();
    const plunderConfigStore = usePlunderConfigStore();

    // Configurações do assistente de saque.
    const plunderConfig = (await PlunderConfig.findByPk(alias))?.toJSON();
    if (plunderConfig) {
        for (const [key, value] of Object.entries(plunderConfig) as [T, PlunderConfigType[T]][]) {
            if (key in plunderConfigStore) {
                plunderConfigStore[key] = value;
            };
        };

        // Atualiza o painel com as configurações do alias atual.
        panelWindow.webContents.send('panel:patch-plunder-config', plunderConfig);
    };
};

async function patchPlunderHistory<T extends keyof PlunderHistoryType>(
    alias: UserAlias,
    PlunderHistory: typeof PlunderHistoryTable,
    usePlunderHistoryStore: typeof usePlunderHistoryStoreType
) {
    const panelWindow = getPanelWindow();
    const plunderHistoryStore = usePlunderHistoryStore();

    // Histórico do assistente de saque.
    const plunderHistory = (await PlunderHistory.findByPk(alias))?.toJSON();
    if (plunderHistory) {
        for (const [key, value] of Object.entries(plunderHistory) as [T, PlunderHistoryType[T] | null][]) {
            if (!value) continue;

            // A propriedade 'villages' não é atualizada, pois é um objeto Proxy.
            if (key in plunderHistoryStore && key !== 'villages') {
                plunderHistoryStore[key] = value;
            } else if (key === 'villages') {
                // Atualiza o histórico individual de cada aldeia.
                const now = Date.now();
                for (const [villageId, villageHistory] of Object.entries(value) as [string, PlunderHistoryVillageType[]][]) {
                    plunderHistoryStore.villages[villageId] = villageHistory.filter((log) => {
                        return log.addedAt >= (now - Kronos.Month);
                    });
                };
            };
        };
        
        // Atualiza o painel com o histórico de saque do alias atual.
        panelWindow.webContents.send('panel:patch-plunder-history', plunderHistory);
    };
};