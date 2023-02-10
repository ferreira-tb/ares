import { reactive } from 'vue';
import { assert } from '$global/error.js';

class AvailableFarmUnits {
    spear = 0;
    sword = 0;
    axe = 0;
    spy = 0;
    light = 0;
    heavy = 0;
    knight = 0;
    archer = 0;
    marcher = 0;
    ram = 0;
};

/** Quantidade de unidades disponíveis no assistente de saque. */
export const availableUnits = reactive(new AvailableFarmUnits());

/**
 * Analisa a linha com as tropas disponíveis e armazena as informações num objeto reativo.
 * Um `MutationObserver` garante que o objeto esteja sempre atualizado.
 */
export function queryAvailableUnits() {
    const unitsRow = document.queryAndAssert('#farm_units #units_home tr:has(td#spear):has(td#sword)');
    
    queryUnitsRow(unitsRow);
    const observer = new MutationObserver(() => queryUnitsRow(unitsRow));
    observer.observe(unitsRow, { subtree: true, childList: true });
};

function queryUnitsRow(unitsRow: Element) {
    const unitFields = unitsRow.queryAsArray('td[id][class*="unit" i]');
    assert(unitFields.length >= 7, 'Não foi possível encontrar os campos com as unidades disponíveis.');

    for (const field of unitFields) {
        const unitType = field.assertAttribute<keyof AvailableFarmUnits>('id');
        const amount = field.parseInt();
        if (unitType in availableUnits && availableUnits[unitType] !== amount) {
            availableUnits[unitType] = amount;
        };
    };
};