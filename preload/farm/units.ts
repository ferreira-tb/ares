import { reactive } from 'vue';
import { PlunderModel } from '$/farm/models.js';
import { assert } from '@/error.js';

class AvailableFarmUnits extends PlunderModel {
    ram = 0;

    constructor() {
        super();
    };
};

/** Quantidade de unidades disponíveis no assistente de saque. */
const units = reactive(new AvailableFarmUnits());

/**
 * Analisa a linha com as tropas disponíveis e armazena as informações num objeto reativo.
 * Um `MutationObserver` garante que o objeto esteja sempre atualizado.
 */
export function queryAvailableUnits(): AvailableFarmUnits {
    const unitsRow = document.queryAndAssert('#farm_units #units_home tr:has(td#spear):has(td#sword)');
    
    queryUnitsRow(unitsRow);
    const observer = new MutationObserver(() => queryUnitsRow(unitsRow));
    observer.observe(unitsRow, { subtree: true, childList: true });

    return units;
};

function queryUnitsRow(unitsRow: Element) {
    const unitFields = unitsRow.queryAsArray('td[id][class*="unit" i]');
    assert(unitFields.length >= 7, 'Não foi possível encontrar os campos com as unidades disponíveis.');

    for (const field of unitFields) {
        const unitType = field.assertAttribute<keyof AvailableFarmUnits>('id');
        const amount = field.parseInt();
        if (unitType in units && units[unitType] !== amount) {
            units[unitType] = amount;
        };
    };
};