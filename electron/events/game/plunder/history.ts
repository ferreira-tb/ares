import { ipcMain, webContents } from 'electron';
import { storeToRefs, watch } from 'mechanus';
import { Kronos } from '@tb-dev/kronos';
import { assertInteger } from '$common/guards';
import { MainProcessError } from '$electron/error';
import { isUserAlias, assertUserAlias } from '$common/guards';
import { StandardWindow } from '$electron/windows';
import { usePlunderHistoryStore, useCacheStore } from '$electron/stores';
import { PlunderHistory } from '$electron/database/models';
import { StandardWindowName } from '$common/enum';
import { DefaultPlunderHistory, PlunderHistoryVillage } from '$common/templates';

export function setPlunderHistoryEvents() {
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    const plunderHistoryStore = usePlunderHistoryStore();

    ipcMain.on('plunder:show-history', () => {
        StandardWindow.open(StandardWindowName.PlunderHistory);
    });

    // Emitido pela view após cada ataque realizado pelo Plunder.
    ipcMain.on('plunder:attack-sent', <T extends keyof PlunderAttackLog>(
        _e: unknown, villageId: number | null, attackLog: PlunderAttackLog
    ) => {
        assertInteger(villageId, 'Could not update plunder history: village id is invalid.');
        // A propriedade `villages` está envolvida em um Proxy.
        // Se não houverem registros de ataque contra a aldeia, o Proxy criará uma nova array.
        const village = plunderHistoryStore.villages[villageId.toString(10)];
        const midnight = new Date().setUTCHours(0, 0, 0, 0);
        let today = village.find((log) => log.addedAt === midnight);
        if (!today) {
            today = new PlunderHistoryVillage();
            village.push(today);
        };

        for (const [key, value] of Object.entries(attackLog) as [T, PlunderAttackLog[T]][]) {
            assertInteger(value, `Could not update plunder history: ${key} is not an integer.`);
            plunderHistoryStore[key] += value;
            today[key] += value;
        };

        patchAllWebContents(plunderHistoryStore.toClonable());
    });

    // Esse canal é apenas para a aquisição inicial dos dados.
    // Não deve ser usado para atualizar os dados após mudança do alias, pois surgirão race conditions.
    // Para sincronização, o renderer deve possuir listeners para o evento `plunder:patch-history`.
    // Ou, para o histórico das aldeias, o evento `plunder:did-update-villages-history`.
    ipcMain.handle('plunder:get-history', (_e, omitVillages: boolean = false) => {
        return plunderHistoryStore.toClonable(omitVillages);
    });

    ipcMain.on('plunder:save-history', async () => {
        try {
            const alias = userAlias.value;
            assertUserAlias(alias, MainProcessError, 'Could not save plunder history: user alias is not valid.');
            await PlunderHistory.saveHistory(alias);
        } catch (err) {
            MainProcessError.catch(err);
        };
    });

    watch(userAlias, async (alias) => {
        if (!isUserAlias(alias)) return;

        const previousHistory = (await PlunderHistory.findByPk(alias))?.toJSON();
        if (previousHistory) {
            // `villages` é um Proxy na store, então é necessário lidar com ele separadamente.
            const { villages, ...history } = previousHistory;
            plunderHistoryStore.$patch(history);
            
            const now = Date.now();
            plunderHistoryStore.villages = plunderHistoryStore.proxifyVillages();
            for (const [villageId, villageHistory] of Object.entries(villages)) {
                plunderHistoryStore.villages[villageId] = villageHistory.filter((log) => {
                    return log.addedAt >= (now - Kronos.Month);
                });
            };

            patchAllWebContents(plunderHistoryStore.toClonable());

        } else {
            const defaultHistory = new DefaultPlunderHistory();
            plunderHistoryStore.$patch({ ...defaultHistory, villages: plunderHistoryStore.proxifyVillages() });
            patchAllWebContents(defaultHistory);
        };
    });
};

/** Comunica a mudança aos processos diferentes daquele que enviou os dados. */
function patchAllWebContents<T extends keyof PlunderHistoryType>(
    data: PlunderHistoryType, sender?: Electron.WebContents
) {
    // Se a janela de histórico estiver aberta, atualiza-a com o histórico das aldeias.
    const historyWindow = StandardWindow.getWindow(StandardWindowName.PlunderHistory);
    historyWindow?.webContents.send('plunder:did-update-villages-history', data.villages);

    const partial = Object.entries(data).reduce((acc, [key, value]: [T, PlunderHistoryType[T]]) => {
        if (key === 'villages') return acc;
        acc[key] = value;
        return acc;
    }, {} as PlunderHistoryType);

    for (const contents of webContents.getAllWebContents()) {
        if (contents === historyWindow?.webContents) continue;
        if (sender && contents === sender) continue;

        // Para os outros, envia apenas a quantidade total, sem dados detalhados.
        contents.send('plunder:patch-history', partial);
    };
};