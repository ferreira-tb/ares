import { storeToRefs } from 'mechanus';
import { getPanelWindow } from '$electron/utils/helpers';
import { isUserAlias } from '$electron/utils/guards';
import { fetchVillageGroups, patchVillageGroups } from '$electron/utils/groups';
import { AliasPatchError } from '$electron/error';
import { sequelize } from '$electron/database';
import type { PlunderAttackDetails, PlunderHistoryType } from '$types/plunder';
import type { UserAlias } from '$types/electron';
import type { PlunderConfig as PlunderConfigTable, PlunderHistory as PlunderHistoryTable } from '$database/plunder';
import type { VillageGroups as VillageGroupsTable } from '$database/groups';
import type { definePlunderConfigStore, setPlunderHistoryStores } from '$stores/plunder';
import type { defineGroupsStore } from '$stores/groups';

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
    usePlunderConfigStore: ReturnType<typeof definePlunderConfigStore>,
    useLastPlunderHistoryStore: ReturnType<typeof setPlunderHistoryStores>['useLastPlunderHistoryStore'],
    useTotalPlunderHistoryStore: ReturnType<typeof setPlunderHistoryStores>['useTotalPlunderHistoryStore'],

    VillageGroups: typeof VillageGroupsTable,
    useGroupsStore: ReturnType<typeof defineGroupsStore>
) {
    const plunderArgs = [
        PlunderConfig,
        PlunderHistory,
        usePlunderConfigStore,
        useLastPlunderHistoryStore,
        useTotalPlunderHistoryStore
    ] as const;

    return async function (alias: UserAlias | null) {
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
    usePlunderConfigStore: ReturnType<typeof definePlunderConfigStore>,
    useLastPlunderHistoryStore: ReturnType<typeof setPlunderHistoryStores>['useLastPlunderHistoryStore'],
    useTotalPlunderHistoryStore: ReturnType<typeof setPlunderHistoryStores>['useTotalPlunderHistoryStore']
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
        panelWindow.webContents.send('patch-panel-plunder-config', plunderConfig);
    };

    // Histórico do assistente de saque.
    const plunderHistory = (await PlunderHistory.findByPk(alias))?.toJSON();
    if (plunderHistory) {
        for (const [key, value] of Object.entries(plunderHistory) as [keyof PlunderHistoryType, PlunderAttackDetails][]) {
            if (!value) continue;

            if (key === 'last') {
                for (const [innerKey, innerValue] of Object.entries(value)) {
                    if (innerKey in lastPlunderHistoryStore) {
                        Reflect.set(lastPlunderHistoryStore, innerKey, innerValue);
                    };
                };
                
            } else if (key === 'total') {
                for (const [innerKey, innerValue] of Object.entries(value)) {
                    if (innerKey in totalPlunderHistoryStore) {
                        Reflect.set(totalPlunderHistoryStore, innerKey, innerValue);
                    };
                };
            };
        };

        // Se o Plunder estiver ativo para o alias atual, atualiza o painel com o histórico de recursos.
        // Isso permite que ele continue de onde parou.
        if (plunderConfig && plunderConfig.active === true) {
            panelWindow.webContents.send('patch-panel-plunder-history', plunderHistory);
        };
    };
};

async function patchGroupsStoreState(
    alias: UserAlias,
    VillageGroups: typeof VillageGroupsTable,
    useGroupsStore: ReturnType<typeof defineGroupsStore>
) {
    try {
        const groupsStore = useGroupsStore();
        const { all } = storeToRefs(groupsStore);

        // Obtém os grupos do banco de dados.
        const villageGroups = await VillageGroups.findByPk(alias);
        let groups = new Set(villageGroups?.allGroups ?? []);
        if (groups.size === 0) groups = await fetchVillageGroups();
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