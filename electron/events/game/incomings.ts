import { ipcMain } from 'electron';
import { computed, storeToRefs, watch } from 'mechanus';
import { Kronos } from '@tb-dev/kronos';
import { TribalWorker } from '$electron/worker';
import { MainWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import { useAresStore, useIncomingsStore } from '$electron/stores';
import { GameSearchParams, TribalWorkerName } from '$common/constants';
import { MainProcessError } from '$electron/error';

export function setIncomingAttacksEvents() {
    const incomingsStore = useIncomingsStore();
    const { amount, incomings } = storeToRefs(incomingsStore);

    const mainWindow = MainWindow.getInstance();

    ipcMain.on('game:update-incomings-amount', (_e, newAmount: number | null) => {
        amount.value = newAmount;
        mainWindow.webContents.send('game:incomings-amount-did-update', newAmount);
    });

    ipcMain.on('game:update-incomings-info', (_e, newIncomings: IncomingAttack[]) => {
        incomings.value = newIncomings;
        mainWindow.webContents.send('game:incomings-info-did-update', newIncomings);
    });

    ipcMain.on('tribal-worker:will-handle-incoming-attack', () => {
        mainWindow.webContents.send('tribal-worker:will-handle-incoming-attack');
    });

    ipcMain.on('tribal-worker:did-handle-incoming-attack', () => {
        mainWindow.webContents.send('tribal-worker:did-handle-incoming-attack');
    });

    ipcMain.on('tribal-worker:did-fail-to-handle-incoming-attack', () => {
        mainWindow.webContents.send('tribal-worker:did-fail-to-handle-incoming-attack');
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

    function createWorker() {
        if (worker?.destroyed) worker = null;
        if (worker) {
            // O uso do timeout impede que o worker seja sobrecarregado quando houver muitas requisições.
            if (timeout) {
                timeout.refresh();
            } else {
                timeout = setTimeout(createWorker, Kronos.Second * 5);
            };

        } else {
            const url = BrowserTab.createURL(GameSearchParams.Incomings);
            worker = new TribalWorker(TribalWorkerName.HandleIncomings, url);
            worker.once('port:message', (message) => {
                if (message === 'destroy') {
                    setTimeout(() => worker?.destroy(), delay.value);
                };
            });

            worker.init().catch(MainProcessError.catch);
        };
    };

    return function(value: number | null) {
        if (value !== null) createWorker();
    };
};