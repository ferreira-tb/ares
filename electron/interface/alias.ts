import { storeToRefs } from 'mechanus';
import { getPanelWindow } from '$electron/utils/helpers';
import { isUserAlias } from '$global/guards';
import { fetchVillageGroups, patchVillageGroups } from '$electron/utils/groups';
import { AliasPatchError } from '$electron/error';
import { sequelize } from '$electron/database';
import type { PlunderAttackDetails, PlunderHistoryType } from '$types/plunder';
import type { UserAlias } from '$types/electron';
import type { PlunderConfig as PlunderConfigTable, PlunderHistory as PlunderHistoryTable } from '$database/plunder';
import type { VillageGroups as VillageGroupsTable } from '$database/groups';

import type {
    useGroupsStore as useGroupsStoreType,
    usePlunderConfigStore as usePlunderConfigStoreType,
    useLastPlunderHistoryStore as useLastPlunderHistoryStoreType,
    useTotalPlunderHistoryStore as useTotalPlunderHistoryStoreType
} from '$electron/interface';

/**
 * Define o estado das stores de acordo com o alias atual.
 * 
 * Essa função deve ser chamada sempre que o alias for alterado.
 * A responsabilidade de chamar essa função é do Proxy `cacheProxy`.
 * 
 * Entende-se como "alias" o padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`.
 */
export function patchAliasRelatedStores(
    PlunderConfig: typeof PlunderConfigTable,
    PlunderHistory: typeof PlunderHistoryTable,
    usePlunderConfigStore: typeof usePlunderConfigStoreType,
    useLastPlunderHistoryStore: typeof useLastPlunderHistoryStoreType,
    useTotalPlunderHistoryStore: typeof useTotalPlunderHistoryStoreType,

    VillageGroups: typeof VillageGroupsTable,
    useGroupsStore: typeof useGroupsStoreType
) {
    const plunderArgs = [
        PlunderConfig,
        PlunderHistory,
        usePlunderConfigStore,
        useLastPlunderHistoryStore,
        useTotalPlunderHistoryStore
    ] as const;

    return async function(alias: UserAlias | null) {
        try {
            if (!isUserAlias(alias)) return;
            await Promise.all([
                patchAllPlunderStoresState(alias, ...plunderArgs),
                patchGroupsStoreState(alias, VillageGroups, useGroupsStore)
            ]);
        } catch (err) {
            AliasPatchError.catch(err);
        };
    };
};

async function patchAllPlunderStoresState(
    alias: UserAlias,
    PlunderConfig: typeof PlunderConfigTable,
    PlunderHistory: typeof PlunderHistoryTable,
    usePlunderConfigStore: typeof usePlunderConfigStoreType,
    useLastPlunderHistoryStore: typeof useLastPlunderHistoryStoreType,
    useTotalPlunderHistoryStore: typeof useTotalPlunderHistoryStoreType
) {
    const panelWindow = getPanelWindow();
    const plunderConfigStore = usePlunderConfigStore();
    const lastPlunderHistoryStore = useLastPlunderHistoryStore();
    const totalPlunderHistoryStore = useTotalPlunderHistoryStore();

    // Configurações do assistente de saque.
    const plunderConfig = (await PlunderConfig.findByPk(alias))?.toJSON();
    if (plunderConfig) {
        for (const [key, value] of Object.entries(plunderConfig)) {
            if (key in plunderConfigStore) {
                Reflect.set(plunderConfigStore, key, value);
            };
        };

        // Atualiza o painel com as configurações para o alias atual.
        panelWindow.webContents.send('panel:patch-plunder-config', plunderConfig);
    };

    // Histórico do assistente de saque.
    const plunderHistory = (await PlunderHistory.findByPk(alias))?.toJSON();
    if (plunderHistory) {
        for (const [key, value] of Object.entries(plunderHistory) as [keyof PlunderHistoryType, PlunderAttackDetails][]) {
            if (key === 'last') {
                patchHistoryStore(value, lastPlunderHistoryStore);
            } else {
                patchHistoryStore(value, totalPlunderHistoryStore);
            };
        };

        // Se o Plunder estiver ativo para o alias atual, atualiza o painel com o histórico de recursos.
        // Isso permite que ele continue de onde parou.
        if (plunderConfig?.active) {
            panelWindow.webContents.send('panel:patch-plunder-history', plunderHistory);
        };
    };
};

type HistoryStores = ReturnType<typeof useLastPlunderHistoryStoreType> | ReturnType<typeof useTotalPlunderHistoryStoreType>;
function patchHistoryStore<T extends PlunderAttackDetails, U extends HistoryStores, V extends keyof U>(state: T, store: U) {
    for (const [key, value] of Object.entries(state) as [V, U[V]][]) {
        if (key in store) {
            store[key] = value;
        };
    };
};

async function patchGroupsStoreState(
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
                id: alias,
                allGroups: [...groups]
            }, { transaction });
        });

    } catch (err) {
        AliasPatchError.catch(err);
    };
};