import { nextTick } from 'vue';
import { Deimos } from '$deimos/interface/ipc';
import { useUnitsStore } from '$renderer/stores/units';
import { assertUnit } from '$shared/guards';
import { ipcInvoke } from '$renderer/ipc';
import { PlunderError } from '$browser/error';

/** Atualiza a quantidade de unidades disponíveis no assistente de saque. */
export async function queryAvailableUnits() {
    const unitStore = useUnitsStore();
    const units = await Deimos.invoke('get-current-village-units');

    // Se não foi possível obter as unidades a partir do Deimos, tenta obter do DOM.
    if (units) {
        unitStore.$patch(units);
    } else {
        queryUnitsRow(unitStore);
    };

    const updated = await ipcInvoke('deimos:update-current-village-units', unitStore.raw());
    if (!updated) throw new PlunderError('Could not update available units.');
    await nextTick();
};

function queryUnitsRow(unitStore: ReturnType<typeof useUnitsStore>) {
    const selector = '#farm_units #units_home tr:has(td#spear):has(td#sword)';
    const unitsRow = document.queryAndAssert<HTMLTableRowElement>(selector);

    const unitFields = unitsRow.queryAsArray('td[id][class*="unit" i]');
    if (unitFields.length < 7) throw new PlunderError('Could not find all unit fields.');

    for (const field of unitFields) {
        const unitType = field.getAttributeStrict<AllUnits>('id');
        assertUnit(unitType, PlunderError, `${unitType} is not a valid unit type.`);
        unitStore[unitType] = field.parseIntStrict();
    };
};