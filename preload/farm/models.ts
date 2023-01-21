import { computed, ref, watchSyncEffect } from 'vue';
import { assert } from '@/error.js';
import { units } from '$/farm/units.js';
import { farmUnits } from '@/constants.js';
import type { FarmUnits } from '@/types.js';

export class PlunderModel {
    /** Indica se há tropas o suficiente para o modelo ser usado. */
    ok = false;
    /** Capacidade de carga. */
    carry = 0;

    // Unidades.
    spear = 0;
    sword = 0;
    axe = 0;
    spy = 0;
    light = 0;
    heavy = 0;
    knight = 0;
    archer = 0;
    marcher = 0;
};

const modelA = new PlunderModel();
const modelB = new PlunderModel();

/** Representa o total de recursos disponíveis na aldeia-alvo. */
export const resources = ref<number>(0);
const bestModel = ref<PlunderModel | null>(null);
const otherModel = ref<PlunderModel | null>(null);

/** Modelo que deve ser usado no ataque. Se `null`, não é possível atacar. */
export const attackModel = computed<PlunderModel | null>(() => {
    if (bestModel.value === null && otherModel.value === null) return null;
    if (bestModel.value?.ok === true) return bestModel.value;
    if (otherModel.value?.ok === true) return otherModel.value;
    return null;
});

/** Obtêm informações sobre os modelos de saque. */
export function queryModelData() {
    // Corpo da tabela com os modelos do assistente de saque.
    const modelTable = document.queryAndAssert('#content_value form tbody:has(td input[type="text"][name^="spear" i])');

    // Campos do modelo A.
    const aRow = modelTable.queryAndAssert('tr:nth-of-type(2):has(td input[type="text"][name^="spear" i])');
    const aFields = aRow.queryAsArray('td input[type="text"][name]');
    assert(aFields.length >= 7, 'Não foi possível encontrar os campos de texto do modelo A.');
    parseUnitAmount('a', aFields);

    const aCarryField = aRow.queryAndAssert('td:not(:has(input[data-tb-model-a])):not(:has(input[type*="hidden"]))');
    modelA.carry = aCarryField.parseInt();

    // Campos do modelo B.
    const bRow = modelTable.queryAndAssert('tr:nth-of-type(4):has(td input[type="text"][name^="spear" i])');
    const bFields = bRow.queryAsArray('td input[type="text"][name]');
    assert(bFields.length >= 7, 'Não foi possível encontrar os campos de texto do modelo B.');
    parseUnitAmount('b', bFields);

    const bCarryField = bRow.queryAndAssert('td:not(:has(input[data-tb-model-b])):not(:has(input[type*="hidden"]))');
    modelB.carry = bCarryField.parseInt();
};

/**
 * Analisa o conteúdo da linha para determinar a quantidade de tropas disponíveis.
 * Em seguida, guarda as informações nos respectivos modelos.
 * @param row Identificador da linha.
 * @param fields Campos da linha.
 */
function parseUnitAmount(row: 'a' | 'b', fields: Element[]) {
    const model = row === 'a' ? modelA : modelB;
    const verify = (unit: string): unit is FarmUnits => farmUnits.includes(unit as FarmUnits);

    for (const field of fields) {
        /** O atributo `name` é usado para determinar a unidade referente ao campo. */
        const fieldName = field.assertAttribute('name');
        /** O valor no atributo `name` é algo como `spear[11811]`. */
        const unitType = fieldName.slice(0, fieldName.indexOf('\['));

        assert(verify(unitType), `${unitType} não é uma unidade válida.`);
        field.setAttribute(`data-tb-model-${row}`, unitType);
        
        /** Contém a quantidade de unidades. */
        model[unitType] = field.assertAttributeAsInt('value');
    };
};

watchSyncEffect(() => {
    const bigger = modelA.carry >= modelB.carry ? modelA : modelB;
    const smaller = modelA.carry < modelB.carry ? modelA : modelB;

    // Se ambos são menores que a quantidade de recursos, o maior entre eles prevalecerá.
    // A diferença entre a carga do maior e a quantidade de recursos não é relevante nesse caso.
    if (resources.value >= bigger.carry) {
        bestModel.value = bigger;
        otherModel.value = smaller;

    // Se os dois são maiores, descartam-se aqueles que estejam fora da zona aceitável.
    // Se todos forem descartados, não haverá ataque.
    } else if (resources.value <= smaller.carry) {
        bestModel.value = resources.value / smaller.carry >= 0.8 ? smaller : null;
        otherModel.value = resources.value / bigger.carry >= 0.8 ? bigger : null;

    // Nesse caso, a quantidade de recursos é maior que a carga de um, mas menor que a de outro.
    } else {
        // Razão em relação ao maior (será sempre MENOR que 1).
        const ratioBigger = resources.value / bigger.carry;
        // Razão em relação ao menor (será sempre MAIOR que 1).
        const ratioSmaller = resources.value / smaller.carry;

        // O de maior carga é descartado caso seja grande demais.
        // O menor é dado como válido pois valores menores são sempre adequados.
        if (ratioBigger < 0.8) {
            bestModel.value = smaller;
            otherModel.value = null;

        // Caso o maior seja válido, verifica-se qual está mais próximo da quantidade de recursos.
        } else {
            bestModel.value = (1 - ratioBigger) <= (ratioSmaller - 1) ? bigger : smaller;
            otherModel.value = (1 - ratioBigger) > (ratioSmaller - 1) ? bigger : smaller;
        };
    };

    // Se a quantidade de unidades disponíveis não for suficiente, o modelo não poderá ser usado.
    let aIsOk = true;
    let bIsOk = true;

    for (const [key, value] of Object.entries(units) as [keyof typeof units, number][]) {
        if (key === 'ram') continue;
        if (bestModel.value !== null && value < bestModel.value[key]) {
            bestModel.value.ok = false;
            aIsOk = false;
        };
        if (otherModel.value !== null && value < otherModel.value[key]) {
            otherModel.value.ok = false;
            bIsOk = false;
        };
    };

    // Se não for detectada deficiência de unidades, libera o modelo para uso.
    if (aIsOk === true && bestModel.value !== null) bestModel.value.ok = true;
    if (bIsOk === true && otherModel.value !== null) otherModel.value.ok = true;
});