import { ipcMain, webContents } from 'electron';
import { storeToRefs, watch } from 'mechanus';
import { Kronos } from '@tb-dev/kronos';
import { assertInteger } from '$common/guards';
import { MainProcessError } from '$electron/error';
import { isUserAlias, assertUserAlias } from '$common/guards';
import { PanelWindow } from '$electron/windows';
import { StandardWindow } from '$electron/windows';
import { usePlunderHistoryStore, useCacheStore } from '$electron/stores';
import { PlunderHistory } from '$electron/database/models';
import { StandardWindowName } from '$common/constants';
import { DefaultPlunderHistory, PlunderHistoryVillage } from '$common/templates';

export function setPlunderHistoryEvents() {
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    const plunderHistoryStore = usePlunderHistoryStore();
    const panelWindow = PanelWindow.getInstance();

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

        panelWindow.webContents.send('plunder:attack-sent', attackLog);

        // Se a janela de histórico estiver aberta, atualiza-a.
        const historyWindow = StandardWindow.getWindow(StandardWindowName.PlunderHistory);
        historyWindow?.webContents.send('plunder:history-did-update', plunderHistoryStore.toClonable());
    });

    ipcMain.handle('plunder:get-history', () => plunderHistoryStore.toClonable());

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

            // As stores do renderer não contêm `villages`, apenas o processo principal.
            patchAllWebContents(history);

            const now = Date.now();
            plunderHistoryStore.villages = plunderHistoryStore.proxifyVillages();
            for (const [villageId, villageHistory] of Object.entries(villages)) {
                plunderHistoryStore.villages[villageId] = villageHistory.filter((log) => {
                    return log.addedAt >= (now - Kronos.Month);
                });
            };

        } else {
            const defaultHistory = new DefaultPlunderHistory();
            plunderHistoryStore.$patch({ ...defaultHistory, villages: plunderHistoryStore.proxifyVillages() });
            patchAllWebContents(defaultHistory);
        };
    });
};

/** Comunica a mudança aos processos diferentes daquele que enviou os dados. */
function patchAllWebContents(data: Omit<PlunderHistoryType, 'villages'>, sender?: Electron.WebContents) {
    for (const contents of webContents.getAllWebContents()) {
        if (sender && contents === sender) continue;
        contents.send('plunder:patch-history', data);
    };
};