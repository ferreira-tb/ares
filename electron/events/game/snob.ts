import { ipcMain, webContents } from 'electron';
import { ref, storeToRefs, watch, type MechanusRef } from 'mechanus';
import { Kronos } from '@tb-dev/kronos';
import { useAresStore, useCacheStore, SnobConfig, SnobHistory } from '$electron/interface';
import { sequelize } from '$electron/database';
import { MainProcessEventError } from '$electron/error';
import { TribalWorker } from '$electron/worker';
import { GameSearchParams, TribalWorkerName } from '$common/constants';
import { assertUserAlias, isUserAlias } from '$common/guards';
import { DefaultSnobConfig, DefaultSnobHistory } from '$common/templates';

export function setSnobEvents() {
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    /** Indica se a cunhagem automática está ativa. */
    const isMinting = ref(false);
    const mintTimeout = ref<NodeJS.Timeout | null>(null);
    const mintWorker = ref<TribalWorker | null>(null);

    const stopMinting = mintingStopper(mintTimeout, mintWorker);
    const toNextMint = onMint(mintTimeout, mintWorker);

    ipcMain.handle('snob:get-config', getConfig(userAlias));
    ipcMain.handle('snob:get-history', getHistory(userAlias));

    ipcMain.on('snob:update-config', async (e, snobConfig: SnobConfigType) => {
        try {
            const alias = userAlias.value;
            assertUserAlias(alias, MainProcessEventError, 'Cannot update snob config without a valid user alias.');

            await sequelize.transaction(async () => {
                await SnobConfig.upsert({ id: alias, ...snobConfig });
            });

            patchAllWebContents('config', snobConfig, e.sender);
            isMinting.value = snobConfig.active;
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.on('tribal-worker:coin-minted', async (
        e, alias: UserAlias, snobConfig: SnobConfigType, snobHistory: SnobHistoryType
    ) => {
        try {
            await sequelize.transaction(async () => {
                await SnobHistory.upsert({ id: alias, ...snobHistory });
            });

            patchAllWebContents('history', snobHistory, e.sender);
            toNextMint(alias, snobConfig, snobHistory);

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.on('tribal-worker:no-coin-to-mint', (_e, ...args: Parameters<typeof toNextMint>) => toNextMint(...args));
    ipcMain.on('tribal-worker:did-fail-to-mint-coin', (_e, ...args: Parameters<typeof toNextMint>) => toNextMint(...args));

    watch(userAlias, async (newAlias) => {
        try {
            stopMinting();
            if (!isUserAlias(newAlias)) {
                isMinting.value = false;
                return;
            };

            const snobConfig = (await SnobConfig.findByPk(newAlias))?.toJSON();
            if (snobConfig) {
                patchAllWebContents('config', snobConfig);
                isMinting.value = snobConfig.active;
            } else {
                patchAllWebContents('config', new DefaultSnobConfig());
                isMinting.value = false;
            };

            const snobHistory = (await SnobHistory.findByPk(newAlias))?.toJSON();
            if (snobHistory) {
                patchAllWebContents('history', snobHistory);
            } else {
                patchAllWebContents('history', new DefaultSnobHistory());
            };

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    watch(isMinting, async (newValue) => {
        try {
            if (!newValue) {
                stopMinting();
                return;
            };

            const alias = userAlias.value;
            assertUserAlias(alias, MainProcessEventError, 'Cannot start minting without a valid user alias.');
            mintWorker.value = await mint(alias);
        } catch (err) {
            isMinting.value = false;
            MainProcessEventError.catch(err);
        };
    });
};

function patchAllWebContents<T extends 'config' | 'history'>(
    dataType: T,
    data: T extends 'config' ? SnobConfigType : T extends 'history' ? SnobHistoryStore : never,
    sender?: Electron.WebContents
) {
    const channel = `snob:patch-${dataType}`;
    for (const contents of webContents.getAllWebContents()) {
        if (sender && contents === sender) continue;
        contents.send(channel, data);
    };
};

function getConfig(userAlias: MechanusComputedRef<UserAlias | null>) {
    return async function(): Promise<SnobConfigType | null> {
        try {
            const alias = userAlias.value;
            if (!isUserAlias(alias)) return null;
            const snobConfig = (await SnobConfig.findByPk(alias))?.toJSON();
            return snobConfig ?? null;
        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    };
};

function getHistory(userAlias: MechanusComputedRef<UserAlias | null>) {
    return async function(): Promise<SnobHistoryType | null> {
        try {
            const alias = userAlias.value;
            if (!isUserAlias(alias)) return null;
            const snobHistory = (await SnobHistory.findByPk(alias))?.toJSON();
            return snobHistory ?? null;
        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    };
};

async function mint(alias: UserAlias): Promise<TribalWorker> {
    // Destrói qualquer worker que por ventura esteja ativo.
    TribalWorker.destroyWorker(TribalWorkerName.MintCoin);

    const snobConfig = (await SnobConfig.findByPk(alias))?.toJSON();
    if (!snobConfig) {
        throw new MainProcessEventError('Cannot start minting without a valid snob config.');
    };

    const { mode, village, group } = snobConfig;
    const search = mode === 'single' ? GameSearchParams.SnobTrain : GameSearchParams.SnobCoin;
    const url = TribalWorker.createURL(search);

    const snobHistory = (await SnobHistory.findByPk(alias))?.toJSON() ?? null;

    if (mode === 'single') {
        if (!village) {
            throw new MainProcessEventError('Cannot mint coins on single mode without a village being set.');
        };
        url.searchParams.set('village', village.toString(10));
    } else {
        url.searchParams.set('group', group.toString(10));
    };

    const worker = new TribalWorker(TribalWorkerName.MintCoin, url);
    await worker.init();

    await worker.toBeReady();
    worker.send('tribal-worker:mint-coin', alias, snobConfig, snobHistory);
    return worker;
};

function onMint(
    timeout: MechanusRef<NodeJS.Timeout | null>,
    worker: MechanusRef<TribalWorker | null>
) {
    const aresStore = useAresStore();
    const { captcha } = storeToRefs(aresStore);

    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    return function(alias: UserAlias, snobConfig: SnobConfigType, snobHistory: SnobHistoryType | null) {
        const baseDelay = getBaseDelay(snobConfig.timeUnit);
        const delay = snobConfig.delay * baseDelay;

        timeout.value = setTimeout(async () => {
            try {
                if (alias !== userAlias.value || !worker.value) return;

                // Se hover um captcha ativo no momento, adia o envio de uma nova requisição.
                if (captcha.value && timeout.value) {
                    timeout.value.refresh();
                    return;
                };

                worker.value.reload();
                await worker.value.toBeReady();
                worker.value.send('tribal-worker:mint-coin', alias, snobConfig, snobHistory);
            } catch (err) {
                MainProcessEventError.catch(err);
            };
        }, delay);
    };
};

function getBaseDelay(timeUnit: SnobConfigType['timeUnit']): Kronos {
    if (timeUnit === 'seconds') return Kronos.Second;
    if (timeUnit === 'minutes') return Kronos.Minute;
    return Kronos.Hour;
};

function mintingStopper(
    timeout: MechanusRef<NodeJS.Timeout | null>,
    worker: MechanusRef<TribalWorker | null>
) {
    return function(): void {
        if (timeout.value) {
            clearTimeout(timeout.value);
            timeout.value = null;
        };
    
        if (worker.value) {
            worker.value.destroy();
            worker.value = null;
        };
    };
};