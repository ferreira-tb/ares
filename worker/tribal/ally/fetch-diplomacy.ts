import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { ipcOn } from '$renderer/ipc';
import { TribalWorkerError } from '$worker/error';

ipcOn('port', (e) => {
    const port = e.ports[0];
    port.onmessageerror = TribalWorkerError.onMessageError;

    fetchDiplomacy(port);
});

async function fetchDiplomacy(port: MessagePort) {
    try {
        const anchorSelector = 'a[href*="screen=info_ally&id="]';
        const partnersSelector = `#ally_content table#partners:has(${anchorSelector})`;
        const partners = document.querySelector<HTMLTableElement>(partnersSelector);
        if (!partners) {
            port.postMessage(null);
            return;
        };

        const rowsSelector = `tbody tr:where(:has(th), :has(${anchorSelector}))`;
        const rows = partners.queryAsArray<HTMLTableRowElement>(rowsSelector);
        if (rows.length === 0) {
            throw new TribalWorkerError('Failed to parse diplomacy partners: no rows found.');
        } else if (!rows[0].matches('tr:has(th)')) {
            throw new TribalWorkerError('Failed to parse diplomacy partners: first row is not a header.');
        };

        const allies: number[] = [];
        const nap: number[] = [];
        const enemies: number[] = [];
        
        let headerCount = 0;
        for (const row of rows) {
            if (row.matches('tr:has(th)')) {
                headerCount++;
                continue;
            };

            const anchor = row.queryAndAssert<HTMLAnchorElement>(anchorSelector);
            const anchorUrl = new URL(anchor.href, location.origin);
            const id = anchorUrl.searchParams.getAsIntegerStrict('id');

            if (headerCount === 1) allies.push(id);
            else if (headerCount === 2) nap.push(id);
            else if (headerCount === 3) enemies.push(id);
        };

        port.postMessage({ allies, nap, enemies } satisfies RawDiplomacy);

    } catch (err) {
        await TribalWorkerError.catch(err);
        port.postMessage(null);

    } finally {
        port.close();
    };
};