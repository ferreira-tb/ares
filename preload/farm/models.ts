import { assert } from '@/error.js';

export class PlunderModel {
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

    return { modelA, modelB };
};

/**
 * Analisa o conteúdo da linha para determinar a quantidade de tropas disponíveis.
 * Em seguida, guarda as informações nos respectivos modelos.
 * @param row Identificador da linha.
 * @param fields Campos da linha.
 */
function parseUnitAmount(row: 'a' | 'b', fields: Element[]) {
    const model = row === 'a' ? modelA : modelB;
    const verify = (unit: string): unit is keyof PlunderModel => unit in model;

    for (const field of fields) {
        /** O atributo name é usado para determinar a unidade referente ao campo. */
        const fieldName = field.assertAttribute('name');
        /** O valor no atributo name é algo como "spear[11811]". */
        const unitType = fieldName.slice(0, fieldName.indexOf('\['));

        assert(verify(unitType), `${unitType} não é uma unidade válida.`);
        field.setAttribute(`data-tb-model-${row}`, unitType);
        
        /** Contém a quantidade de unidades. */
        model[unitType] = field.assertAttributeAsInt('value');
    };
};