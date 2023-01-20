import { PlunderModel } from "$/farm/models.js";
import { assert } from '@/error.js';

class AvailableFarmUnits extends PlunderModel {
    ram = 0;

    constructor() {
        super();
    };
};

const units = new AvailableFarmUnits();

export function queryAvailableUnits() {
    const unitsRow = document.queryAndAssert('#farm_units #units_home tr:has(td#spear):has(td#sword)');
    const unitFields = unitsRow.queryAsArray('td[id][class*="unit" i]');
    assert(unitFields.length >= 7, 'Não foi possível encontrar os campos com as unidades disponíveis.');

    for (const field of unitFields) {
        const unitType = field.assertAttribute('id').trim();
        
    };
};