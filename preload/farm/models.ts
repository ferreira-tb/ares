import { reactive } from "vue";
import { assert, assertDOM } from "@/error.js";

export class PlunderModel {
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

export const modelA = reactive(new PlunderModel());
export const modelB = reactive(new PlunderModel());

/** Obtêm informações sobre os modelos de saque. */
export function queryModelData() {
    // Corpo da tabela com os modelos do assistente de saque.
    const modelTable = document.querySelector('#content_value form tbody:has(td input[type="text"][name^="spear" i])');
    assertDOM(modelTable, '#content_value form tbody:has(td input[type="text"][name^="spear" i])');

    // Campos do modelo A.
    const aRow = modelTable.querySelector('tr:nth-of-type(2):has(td input[type="text"][name^="spear" i])');
    assertDOM(aRow, 'tr:nth-of-type(2):has(td input[type="text"][name^="spear" i])');

    const aFields = aRow.querySelectorAll('td input[type="text"][name]');
    assert(aFields.length >= 7, 'Não foi possível encontrar os campos de texto do modelo A.');
    parseUnitAmount('a', aFields);

    // Campos do modelo B.
    const bRow = modelTable.querySelector('tr:nth-of-type(4):has(td input[type="text"][name^="spear" i])');
    assertDOM(bRow, 'tr:nth-of-type(4):has(td input[type="text"][name^="spear" i])');

    const bFields = bRow.querySelectorAll('td input[type="text"][name]');
    assert(bFields.length >= 7, 'Não foi possível encontrar os campos de texto do modelo B.');
    parseUnitAmount('b', bFields);

    return { modelA, modelB };
};

/**
 * Analisa o conteúdo da linha para determinar a quantidade de tropas disponíveis.
 * Em seguida, guarda as informações nos respectivos modelos.
 * @param row Identificador da linha.
 * @param fields Campos da linha.
 */
function parseUnitAmount(row: 'a' | 'b', fields: NodeListOf<Element>) {
    const model = row === 'a' ? modelA : modelB;
    const verify = (unit: string): unit is keyof PlunderModel => unit in model;

    for (const field of Array.from(fields)) {
        /** O atributo name é usado para determinar a unidade referente ao campo. */
        const fieldName = field.getAttribute('name');
        assert(fieldName, 'O atributo "name" não foi encontrado no campo de texto do modelo.');

        /** O valor no atributo name é algo como "spear[11811]". */
        const unitType = fieldName.slice(0, fieldName.indexOf('\['));
        /** Contém a quantidade de unidades. */
        const fieldValue = field.getAttribute('value');
        assert(fieldValue, `Não foi possível encontrar o valor do campo de texto (${unitType}).`);

        assert(verify(unitType), `${unitType} não é uma unidade válida.`);
        field.setAttribute(`data-tb-model-${row}`, unitType);
        
        const parsedAmount = Number.parseInt(fieldValue, 10);
        assert(Number.isInteger(parsedAmount), `Quantidade inválida (${unitType}).`);
        model[unitType] = parsedAmount;
    };
};