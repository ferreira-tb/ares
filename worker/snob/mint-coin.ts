import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { ipcRenderer } from 'electron';
import { Kronos } from '@tb-dev/kronos';
import { ipcSend } from '$renderer/ipc';
import { TribalWorkerError } from '$worker/error';
import { SnobHistoryEntry } from '$common/templates/snob';

ipcRenderer.on('tribal-worker:mint-coin', (_e, alias: UserAlias, config: SnobConfigType, history: SnobHistoryType | null) => {
    try {
        if (config.mode === 'single') {
            mintSingle(alias, config, history);
        } else {
            mintGroup();
        };
    } catch (err) {
        TribalWorkerError.catch(err);
    };
});

function mintSingle(alias: UserAlias, config: SnobConfigType, history: SnobHistoryType | null) {
    const coinForm = document.querySelector<HTMLFormElement>('form[action*="action=coin" i]');
    if (!coinForm) {
        ipcSend('tribal-worker:no-coin-to-mint');
        return;
    };

    const coin = coinForm.queryAndAssert<HTMLAnchorElement>('a#coin_mint_fill_max');
    const amount = coin.parseIntStrict();
    coin.click();

    if (!config.village) {
        throw new TribalWorkerError('Village is set but worker don\'t know its id.');
    };

    history = proxify(history);
    let village: SnobHistoryEntryType[] = history.villages[config.village.toString(10)];

    // Remove entradas antigas do histórico.
    const now = Date.now();
    village = village.filter((entry) => entry.addedAt >= (now - Kronos.Month));

    const midnight = new Date().setUTCHours(0, 0, 0, 0);
    let today = village.find((entry) => entry.addedAt === midnight);
    if (!today) {
        today = new SnobHistoryEntry();
        village.push(today);
    };

    today.coins += amount;
    history.coins += amount;

    const submit = coinForm.queryAndAssert<HTMLInputElement>('input[type="submit"]:not([type="hidden"])');

    // Como o histórico contém um proxy, não é possível enviá-lo diretamente para o processo principal.
    const unproxified = { ...history.villages };
    ipcSend('tribal-worker:coin-minted', alias, config, { ...history, villages: unproxified });
    submit.click();
};

function mintGroup() {
    //
};

/** Envolve a propriedade `villages` em um proxy para que seja possível acessar uma vila que ainda não foi registrada. */
function proxify(history: SnobHistoryType | null): SnobHistoryType {
    if (!history) history = { coins: 0, villages: {} } satisfies SnobHistoryType;
    const villages = new Proxy(history.villages, {
        get(target, villageId): SnobHistoryEntryType[] {
            if (typeof villageId !== 'string') villageId = String(villageId);
            if (!(villageId in target) && !Number.isNaN(Number.parseInt(villageId, 10))) {
                target[villageId] = [new SnobHistoryEntry()];
            };
            
            return Reflect.get(target, villageId);
        }
    });

    history.villages = villages;
    return history;
};