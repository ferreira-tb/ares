import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { ipcRenderer } from 'electron';
import { Kronos } from '@tb-dev/kronos';
import { ipcSend } from '$renderer/ipc';
import { TribalWorkerError } from '$worker/error';
import { DefaultSnobHistory, SnobHistoryEntry } from '$common/templates';

ipcRenderer.on('tribal-worker:mint-coin', async (_e, alias: UserAlias, config: SnobConfigType, history: SnobHistoryType | null) => {
    try {
        history ??= new DefaultSnobHistory();
        if (config.mode === 'single') {
            mintSingle(alias, config, history);
        } else {
            mintGroup(alias, config, history);
        };
        
    } catch (err) {
        await TribalWorkerError.catch(err);
        ipcSend('tribal-worker:did-fail-to-mint-coin', alias, config, history);
    };
});

function mintSingle(alias: UserAlias, config: SnobConfigType, history: SnobHistoryType) {
    const coinForm = document.querySelector<HTMLFormElement>('form[action*="action=coin" i]');
    if (!coinForm) {
        ipcSend('tribal-worker:no-coin-to-mint', alias, config, history);
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
    ipcSend('tribal-worker:coin-minted', alias, config, unproxify(history));
    submit.click();
};

function mintGroup(alias: UserAlias, config: SnobConfigType, history: SnobHistoryType) {
    const coinTable = document.querySelector<HTMLTableElement>('table#coin_overview_table');
    if (!coinTable) {
        ipcSend('tribal-worker:no-coin-to-mint', alias, config, history);
        return;
    };

    const selector = 'td:has(select.coin_amount) input#select_anchor_top[type="button"]';
    const selectCoinsButton = coinTable.queryAndAssert<HTMLInputElement>(selector);
    selectCoinsButton.click();

    const villages = Map.fromElements(
        'tr[id^="village_" i]:has(select.select_coins)',
        (row) => row.getAttributeAsIntStrict('id'),
        (row) => getCoinAmountFromRow(row)
    );

    const mintButtonSelector = 'input.mint_multi_button[type="button"]';
    const amountSpanSelector = 'span[id*="selectedBunches_top" i]';

    const cellSelector = `td:has(${mintButtonSelector}):has(${amountSpanSelector})`;
    const coinButtonTableCell = coinTable.queryAndAssert<HTMLTableCellElement>(cellSelector);

    const amountSpan = coinButtonTableCell.queryAndAssert<HTMLSpanElement>('span[id*="selectedBunches_top" i]');
    const totalCoinAmount = amountSpan.parseIntStrict();

    if (totalCoinAmount > 0 && villages.size === 0) {
        throw new TribalWorkerError('Coin amount is greater than zero but no village was selected.');
    } else if (totalCoinAmount !== Array.from(villages.values()).reduce((a, b) => a + b, 0)) {
        throw new TribalWorkerError('Coin amount is different from the sum of villages\' coin amount.');
    };

    history = proxify(history);
    history.coins += totalCoinAmount;

    const now = Date.now();
    const midnight = new Date().setUTCHours(0, 0, 0, 0);
    
    for (const [villageId, amount] of villages.entries()) {
        let village: SnobHistoryEntryType[] = history.villages[villageId.toString(10)];
        village = village.filter((entry) => entry.addedAt >= (now - Kronos.Month));

        let today = village.find((entry) => entry.addedAt === midnight);
        if (!today) {
            today = new SnobHistoryEntry();
            village.push(today);
        };

        today.coins += amount;
    };

    const mintButton = coinButtonTableCell.queryAndAssert<HTMLInputElement>(mintButtonSelector);
    ipcSend('tribal-worker:coin-minted', alias, config, unproxify(history));
    mintButton.click();
};

/** Envolve a propriedade `villages` em um proxy para que seja possível acessar uma vila que ainda não foi registrada. */
function proxify(history: SnobHistoryType): SnobHistoryType {
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

function unproxify(history: SnobHistoryType): SnobHistoryType {
    const villages = { ...history.villages };
    return { ...history, villages };
};

function getCoinAmountFromRow(row: Element): number {
    const select = row.queryAndAssert<HTMLSelectElement>('select.select_coins');
    const options = select.queryAsArray<HTMLOptionElement>('option[value]');
    return options.reduce((amount, option) => {
        const value = option.getAttributeAsIntStrict('value');
        return value > amount ? value : amount;
    }, 0);
};