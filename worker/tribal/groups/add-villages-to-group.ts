import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { Kronos } from '@tb-dev/kronos';
import { ipcInvoke, ipcOn } from '$renderer/ipc';
import { TribalWorkerError } from '$worker/error';

interface AddVillageToGroupData {
    group: number;
    villages: number[];
};

ipcOn('port', (e) => {
    const port = e.ports[0];
    port.onmessageerror = TribalWorkerError.onMessageError;

    port.onmessage = (event) => {
        const data = event.data as AddVillageToGroupData;
        addVillagesToGroup(port, data);
    };
});

const anchorSelector = 'a[onclick*="VillageGroups.loadGroups" i]';
const tableSelector = `.overview_table:has(${anchorSelector})`;

async function addVillagesToGroup(port: MessagePort, data: AddVillageToGroupData) {
    try {
        const table = document.queryAndAssert<HTMLTableElement>(tableSelector);

        const rows = new Map<number, HTMLTableRowElement>();
        const rawRows = table.queryAsArray<HTMLTableRowElement>(`tr:not(.nohover):has(${anchorSelector})`);
        rawRows.forEach((row) => {
            const villageAnchor = row.queryAndAssert<HTMLAnchorElement>('a[href*="village=" i]');
            const url = new URL(villageAnchor.href, location.origin);
            const villageId = url.searchParams.getAsIntegerStrict('village');
            
            if (data.villages.includes(villageId)) {
                rows.set(villageId, row);
            };
        });

        for await (const row of expandRows(rows)) {
            const inputSelector = `input[type="checkbox"][value="${data.group}"]`;
            const groupInput = row.queryAndAssert<HTMLInputElement>(inputSelector);
            if (groupInput.checked) continue;
            groupInput.click();

            const submitSelector = 'input[type="submit"].btn';
            const submit = row.queryAndAssert<HTMLInputElement>(submitSelector);
            submit.click();
        };

        const responseTime = (await ipcInvoke('browser:get-response-time')) ?? 1000;
        setTimeout(() => port.postMessage('destroy'), (Kronos.Second * 3) + responseTime);

    } catch (err) {
        await TribalWorkerError.catch(err);
        port.postMessage('destroy');
    };
};

async function* expandRows(rows: Map<number, HTMLTableRowElement>) {
    const table = document.queryAndAssert<HTMLTableElement>(tableSelector);
    const config = { childList: true, subtree: true };

    const responseTime = (await ipcInvoke('browser:get-response-time')) ?? 1000;

    for (const [villageId, row] of rows.entries()) {
        const rowSelector = `tr#group_edit_tr_${villageId}.nohover`;
        const groupEditRow = table.queryAndAssert<HTMLTableRowElement>(rowSelector);
        const editAnchor = row.queryAndAssert<HTMLAnchorElement>(anchorSelector);

        queueMicrotask(() => editAnchor.click());
        await new Promise<void>((resolve, reject) => {
            const observer = new MutationObserver((mutations) => {
                const didOpen = mutations.some((mutation) => {
                    const nodes = Array.from(mutation.addedNodes);
                    return nodes.some((node) => {
                        if (!(node instanceof HTMLElement)) return false;
                        return node.matches('form:has(#group_table)');
                    });
                });
                
                if (didOpen) {
                    observer.disconnect();
                    resolve();
                };
            });

            observer.observe(table, config);
            setTimeout(reject, (Kronos.Second * 3) + responseTime);
        });

        yield groupEditRow;
    };
};