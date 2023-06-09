import { getPanelWindow } from '$electron/utils/helpers';
import { Kronos } from '@tb-dev/kronos';
import type {
    PlunderConfig as PlunderConfigTable,
    PlunderHistory as PlunderHistoryTable,
    usePlunderConfigStore as usePlunderConfigStoreType,
    usePlunderHistoryStore as usePlunderHistoryStoreType
} from '$electron/interface';

export async function patchPlunderConfig<T extends keyof PlunderConfigType>(
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

export async function patchPlunderHistory<T extends keyof PlunderHistoryType>(
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