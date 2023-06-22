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

class TroopsCounterResult implements TroopsCounterResultType {
    public readonly available = new Units();
    public readonly away = new Units();
    public readonly moving = new Units();
    public readonly own = new Units();

    public readonly support = new Units();
    public readonly village = new Units();
}

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

        // Contêm informações sobre as unidades de cada aldeia do grupo sendo analisado.
        // O grupo é indicado ao se criar o worker, através dos `searchParams`.
        const reduceFn = queryInnerRows(archer, indexMap);
        const troops = unitsTable.queryAsMap('tbody:has(span[data-id] a[href*="village"]):has(.unit-item)',
            (tbody) => queryVillageId(tbody),
            (tbody) => {
                const rows = tbody.queryAsArray<HTMLTableRowElement>('& > tr:not(:last-of-type)');
                return rows.reduce(reduceFn, new TroopsCounterResult());
            }
        );

        port.postMessage(troops);

    } catch (err) {
        TribalWorkerError.catch(err);
        port.postMessage(null);
    }
}

function queryVillageId(tbody: Element) {
    const span = tbody.queryStrict('tr:first-of-type span[data-id]:has(a[href*="village"])');
    const id = span.getAttributeAsIntStrict('data-id');
    return id;
}

function queryInnerRows(archer: boolean, indexMap: Map<number, keyof Units>) {
    const requiredLength = archer ? 13 : 11;
    return function(result: TroopsCounterResult, row: HTMLTableRowElement, rowIndex: number): TroopsCounterResult {
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

        const sum = sumPartial(result, partial);
        if (rowIndex === 0) sum('available');
        else if (rowIndex === 1) sum('village');
        else if (rowIndex === 2) sum('away');
        else if (rowIndex === 3) sum('moving');
        else throw new TribalWorkerError(`Unexpected row index: ${rowIndex}`);

        calcOwn(result);
        calcSupport(result);

        return result;
    };
}

function sumPartial(result: TroopsCounterResult, partial: Units) {
    return function(key: Extract<keyof TroopsCounterResult, 'available' | 'away' | 'moving' | 'village'>) {
        for (const [unit, amount] of Object.entries(partial) as [keyof Units, number][]) {
            result[key][unit] += amount;
        }
    };
}

function calcOwn(result: TroopsCounterResult) {
    for (const unit of Object.keys(result.own) as (keyof Units)[]) {
        result.own[unit] = result.available[unit] + result.away[unit] + result.moving[unit];
    }
}

function calcSupport(result: TroopsCounterResult) {
    for (const unit of Object.keys(result.support) as (keyof Units)[]) {
        result.support[unit] = result.village[unit] - result.available[unit];
    }
}