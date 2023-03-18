import { nextTick } from 'vue';
import { assert, isObject } from '@tb-dev/ts-guard';
import { Deimos } from '$deimos/shared/ipc';
import { useUnitsStore } from '$vue/stores/units';
import { allUnits } from '$global/utils/constants';
import { ipcSend } from '$global/ipc';
import type { AllUnits } from '$types/game';

/** Atualiza a quantidade de unidades disponíveis no assistente de saque. */
export async function queryAvailableUnits() {
    const unitStore = useUnitsStore();
    const units = await Deimos.invoke('get-current-village-units');

    // Se não foi possível obter as unidades a partir do Deimos, tenta obter do DOM.
    if (!isObject(units)) {
        queryUnitsRow(unitStore);
    } else {
        unitStore.$patch(units);
    };

    ipcSend('update-current-village-units', unitStore.raw());
    await nextTick();
};

function queryUnitsRow(unitStore: ReturnType<typeof useUnitsStore>) {
    const selector = '#farm_units #units_home tr:has(td#spear):has(td#sword)';
    const unitsRow = document.queryAndAssert<HTMLTableRowElement>(selector);

    const unitFields = unitsRow.queryAsArray('td[id][class*="unit" i]');
    assert(unitFields.length >= 7, 'Não foi possível encontrar os campos com as unidades disponíveis.');

    for (const field of unitFields) {
        const unitType = field.getAttributeStrict<AllUnits>('id');
        assert(allUnits.includes(unitType), `Tipo inválido de unidade: ${unitType}`);
        const amount = field.parseIntStrict();
        unitStore[unitType] = amount;
    };
};