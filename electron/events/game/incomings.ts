import { URL } from 'node:url';
import { ipcMain } from 'electron';
import { computed, storeToRefs, watch } from 'mechanus';
import { Kronos } from '@tb-dev/kronos';
import { TribalWorker } from '$electron/worker';
import { useAresStore, useIncomingsStore } from '$electron/interface';
import { GameSearchParams } from '$shared/constants';
import { getMainViewWebContents } from '$electron/utils/view';
import { getMainWindow } from '$electron/utils/helpers';
import { MainProcessEventError } from '$electron/error';

export function setIncomingAttacksEvents() {
    const incomingsStore = useIncomingsStore();
    const { amount, incomings } = storeToRefs(incomingsStore);

    const mainWindow = getMainWindow();

    ipcMain.on('game:update-incomings-amount', (_e, newAmount: number | null) => {
        amount.value = newAmount;
        mainWindow.webContents.send('game:incomings-amount-did-update', newAmount);
    });

    ipcMain.on('game:update-incomings-info', (_e, newIncomings: IncomingAttack[]) => {
        incomings.value = newIncomings;
        mainWindow.webContents.send('game:incomings-info-did-update', newIncomings);
    });

    watch(amount, createIncomingsHandler());
};

function createIncomingsHandler() {
    const aresStore = useAresStore();
    const { responseTime } = storeToRefs(aresStore);

    const delay = computed([responseTime], () => {
        return (Kronos.Second * 5) + (responseTime.value ?? 1000);
    });

    let worker: TribalWorker | null = null;
    let timeout: NodeJS.Timeout | null = null;

    async function createWorker() {
        try {
            if (worker?.isDestroyed) worker = null;
            if (worker) {
                if (timeout) {
                    timeout.refresh();
                } else {
                    timeout = setTimeout(createWorker, Kronos.Second * 5);
                };

            } else {
                const mainViewWebContents = getMainViewWebContents();
                const url = new URL(mainViewWebContents.getURL());
                url.search = GameSearchParams.Incomings;
                
                worker = new TribalWorker('handle-incoming-attacks', url);
                await worker.init((e) => {
                    if (e.data === 'destroy') {
                        setTimeout(() => worker?.destroy(), delay.value);
                    };
                });
            };

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    };

    return function(value: number | null) {
        if (value === null) return;
        createWorker().catch(MainProcessEventError.catch);
    };
};