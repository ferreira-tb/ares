import { URL } from 'url';
import { MessageChannelMain } from 'electron';
import { assertInstanceOf } from '@tb-dev/ts-guard';
import { storeToRefs } from 'mechanus';
import { getPanelWindow } from '$electron/utils/helpers';
import { getMainViewWebContents } from '$electron/utils/view';
import { isUserAlias } from '$electron/utils/guards';
import { AliasPatchError } from '$electron/error';
import { createPhobos, destroyPhobos } from '$electron/app/phobos';
import { sequelize } from '$database/database';
import type { PlunderAttackDetails, PlunderHistoryType } from '$types/plunder';
import type { UserAlias } from '$types/electron';
import type { PlunderConfig as PlunderConfigTable, PlunderHistory as PlunderHistoryTable } from '$tables/plunder';
import type { VillageGroups as VillageGroupsTable } from '$tables/groups';
import type { definePlunderConfigStore, setPlunderHistoryStores } from '$stores/plunder';
import type { defineGroupsStore } from '$stores/groups';
import type { VillageGroup } from '$types/game';
import type { PhobosPortMessage } from '$types/phobos';

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
        const mainViewWebContents = getMainViewWebContents();
        const panelWindow = getPanelWindow();
        const groupsStore = useGroupsStore();
        const { all } = storeToRefs(groupsStore);

        // Obtém os grupos do banco de dados.
        const villageGroups = await VillageGroups.findByPk(alias);
        let groups = new Set(villageGroups?.allGroups ?? []);
        if (groups.size === 0) {
            groups = await new Promise<Set<VillageGroup>>(async (resolve, reject) => {
                // Cria o Phobos na tela de grupos manuais.
                // Lá é possível obter tanto os grupos manuais quanto os dinâmicos.
                const url = new URL(mainViewWebContents.getURL());
                url.search = 'screen=overview_villages&&mode=groups&type=static';
                const phobos = await createPhobos('get-village-groups', url, { override: true });
                
                const { port1, port2 } = new MessageChannelMain();
                phobos.webContents.postMessage('port', null, [port2]);
                port1.postMessage({ channel: 'get-village-groups' } satisfies PhobosPortMessage);
    
                port1.on('message', (e) => {
                    try {
                        assertInstanceOf<Set<VillageGroup>>(e.data, Set);
                        resolve(e.data);
                    } catch (err) {
                        reject(err);
                    } finally {
                        port1.close();
                        destroyPhobos(phobos);
                    };
                });
    
                port1.start();
            });
        };

        all.value.clear();
        groups.forEach((group) => all.value.add(group));
        panelWindow.webContents.send('patch-panel-groups-set', all.value);

        if (!villageGroups) {
            await sequelize.transaction(async (transaction) => {
                await VillageGroups.create({
                    id: alias,
                    allGroups: [...groups]
                }, { transaction });
            });
            
        } else {
            await sequelize.transaction(async (transaction) => {
                await VillageGroups.update({ allGroups: [...groups] }, {
                    where: { id: alias },
                    transaction
                });
            });
        };

    } catch (err) {
        AliasPatchError.catch(err);
    };
};