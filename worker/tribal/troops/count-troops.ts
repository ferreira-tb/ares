import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { ipcInvoke, ipcOn } from '$renderer/ipc';
import { TribalWorkerError } from '$worker/error';
import { Units } from '$common/templates';
import { unitsRegex } from '$common/regex';

ipcOn('port', (e) => {
    const port = e.ports[0];
    port.onmessageerror = TribalWorkerError.onMessageError;

    countTroops(port);
});

async function countTroops(port: MessagePort) {
    try {
        const archer = await ipcInvoke('world:is-archer-world');
        if (typeof archer !== 'boolean') {
            throw new TribalWorkerError('Could not determine if world is archer world');
        }

        const unitsTable = document.queryStrict<HTMLTableElement>('#units_table');
        const icons = unitsTable.queryAsArray<HTMLImageElement>('thead th img[src*="unit_"]');
        const indexMap = Map.fromElements(icons, (img: HTMLImageElement) => icons.indexOf(img),
            (img: HTMLImageElement): keyof Units => {
                const src = img.src.match(/unit_\w+\.png/)?.[0];
                if (!src) throw new TribalWorkerError(`Invalid source: ${img.src}`);
                const unit = src.match(unitsRegex)?.[0].replace(/(unit_|\.png)/g, '');
                if (!unit) throw new TribalWorkerError(`Unexpected unit: ${unit}`);
                
                if (archer) {
                    return (unit.includes('unit_marcher') ? 'marcher' : unit) as keyof Units;
                }

                return unit as keyof Units;
            }
        );

        if (indexMap.size !== (archer ? 13 : 11)) {
            throw new TribalWorkerError(`Unexpected size for indexMap: ${indexMap.size}`);
        }

        const tbodyMap = unitsTable.queryAsMap('tbody:has(span[data-id] a[href*="village"]):has(.unit-item)',
            (tbody) => tbody,
            (tbody) => tbody.queryAsArray<HTMLTableRowElement>('& > tr:not(:last-of-type)')
        );

        const troopAmount = Array.from(tbodyMap.values()).reduce(queryInnerRows(archer, indexMap), {
            available: new Units(),
            away: new Units(),
            moving: new Units(),
            own: new Units(),

            support: new Units(),
            village: new Units()
        });

        port.postMessage(troopAmount);

    } catch (err) {
        TribalWorkerError.catch(err);
        port.postMessage(null);
    }
}

function queryInnerRows(archer: boolean, indexMap: Map<number, keyof Units>) {
    const requiredLength = archer ? 13 : 11;
    return function(acc: TroopCounterResult, rows: HTMLTableRowElement[]): TroopCounterResult {
        for (const row of rows) {
            const partial = new Units();
            const units = row.queryAsArray<HTMLSpanElement>('.unit-item');
            if (units.length !== requiredLength) {
                throw new TribalWorkerError(`Unexpected amount of units: ${units.length}`);
            }

            for (const unit of units) {
                if (unit.matches('.hidden')) continue;
                
                const amount = unit.parseIntStrict();
                const unitIndex = units.indexOf(unit);
                const key = indexMap.getStrict(unitIndex);

                partial[key] = amount;
            }

            const sum = sumPartial(acc, partial);
            const rowIndex = rows.indexOf(row);

            if (rowIndex === 0) sum('available');
            else if (rowIndex === 1) sum('village');
            else if (rowIndex === 2) sum('away');
            else if (rowIndex === 3) sum('moving');
            else throw new TribalWorkerError(`Unexpected row index: ${rowIndex}`);
        }

        calcOwn(acc);
        calcSupport(acc);

        return acc;
    };
}

function sumPartial(acc: TroopCounterResult, partial: Units) {
    return function(key: Extract<keyof TroopCounterResult, 'available' | 'away' | 'moving' | 'village'>) {
        for (const [unit, amount] of Object.entries(partial) as [keyof Units, number][]) {
            acc[key][unit] += amount;
        }
    };
}

function calcOwn(acc: TroopCounterResult) {
    for (const unit of Object.keys(acc.own) as (keyof Units)[]) {
        acc.own[unit] = acc.available[unit] + acc.away[unit] + acc.moving[unit];
    }
}

function calcSupport(acc: TroopCounterResult) {
    for (const unit of Object.keys(acc.support) as (keyof Units)[]) {
        acc.support[unit] = acc.village[unit] - acc.available[unit];
    }
}