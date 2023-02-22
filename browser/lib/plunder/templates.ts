import { computed, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { assert } from '@tb-dev/ts-guard';
import { usePlunderConfigStore } from '$vue/stores/plunder.js';
import { useUnitsStore } from '$vue/stores/units.js';
import { isFarmUnit } from '$global/utils/guards.js';
import type { FarmUnits, FarmUnitsAmount } from '$types/game.js';

export class PlunderTemplate {
    /** Tipo do modelo. */
    readonly type: string;
    /** Capacidade de carga. */
    carry = 0;
    /** Indica se há tropas o suficiente para o modelo ser usado. */
    readonly ok = computed(() => {
        const unitStore = useUnitsStore();
        for (const [key, value] of Object.entries(this.units) as [FarmUnits, number][]) {
            if (unitStore[key] < value) return false;
        };

        return true;
    });

    readonly units: FarmUnitsAmount = {
        spear: 0,
        sword: 0,
        axe: 0,
        spy: 0,
        light: 0,
        heavy: 0,
        knight: 0,
        archer: 0,
        marcher: 0
    };

    constructor(type: string) {
        this.type = type;
    };
};

/** Representa todos os modelos de saque. */
const allTemplates = new Map<string, PlunderTemplate>();

/** Obtêm informações sobre os modelos de saque. */
export function queryTemplateData() {
    // Cria os modelos de saque base e os adiciona ao mapa.
    const templateA = new PlunderTemplate('a');
    const templateB = new PlunderTemplate('b');
    allTemplates.set(templateA.type, templateA);
    allTemplates.set(templateB.type, templateB);

    // Corpo da tabela com os modelos do assistente de saque.
    const table = document.queryAndAssert('#content_value form tbody:has(td input[type="text"][name^="spear" i])');

    // Campos do modelo A.
    const aRow = table.queryAndAssert('tr:nth-of-type(2):has(td input[type="text"][name^="spear" i])');
    const aFields = aRow.queryAsArray('td input[type="text"][name]');
    assert(aFields.length >= 7, 'Não foi possível encontrar os campos de texto do modelo A.');
    parseUnitAmount('a', aFields);

    const aCarryField = aRow.queryAndAssert('td:not(:has(input[data-tb-template-a])):not(:has(input[type*="hidden"]))');
    templateA.carry = aCarryField.parseIntStrict();

    // Campos do modelo B.
    const bRow = table.queryAndAssert('tr:nth-of-type(4):has(td input[type="text"][name^="spear" i])');
    const bFields = bRow.queryAsArray('td input[type="text"][name]');
    assert(bFields.length >= 7, 'Não foi possível encontrar os campos de texto do modelo B.');
    parseUnitAmount('b', bFields);

    const bCarryField = bRow.queryAndAssert('td:not(:has(input[data-tb-template-b])):not(:has(input[type*="hidden"]))');
    templateB.carry = bCarryField.parseIntStrict();
};

/**
 * Analisa o conteúdo da linha para determinar a quantidade de tropas disponíveis.
 * Em seguida, guarda as informações nos respectivos modelos.
 * @param row Identificador da linha.
 * @param fields Campos da linha.
 */
function parseUnitAmount(row: 'a' | 'b', fields: Element[]) {
    const template = row === 'a' ? allTemplates.getStrict('a') : allTemplates.getStrict('b');

    for (const field of fields) {
        /** O atributo `name` é usado para determinar a unidade referente ao campo. */
        const fieldName = field.getAttributeStrict('name');
        /** O valor no atributo `name` é algo como `spear[11811]`. */
        const unitType = fieldName.replace(/\[\d+\]/g, '');

        assert(isFarmUnit(unitType), `${unitType} não é uma unidade válida.`);
        field.setAttribute(`data-tb-template-${row}`, unitType);
        
        /** Contém a quantidade de unidades. */
        template.units[unitType] = field.getAttributeAsIntStrict('value');
    };
};

/**
 * Filtra todos os modelos de saque disponíveis de acordo com a quantidade de recursos na aldeia-alvo.
 * Caso a função retorne uma lista vazia, o ataque não deve ser enviado.
 * Ao fim, os modelos são ordenados de acordo com a capacidade de carga.
 * @param resources - Recursos disponíveis na aldeia-alvo.
 */
export async function filterTemplates(resources: number): Promise<PlunderTemplate[]> {
    const configStore = usePlunderConfigStore();
    const { resourceRatio } = storeToRefs(configStore);

    // Separa os modelos em dois grupos, de acordo com sua capacidade de carga.
    // Os modelos com capacidade de carga maior que a quantidade de recursos são colocados no grupo `bigger`.
    // Os demais são colocados no grupo `smaller`.
    let bigger: PlunderTemplate[] = [];
    const smaller: PlunderTemplate[] = [];

    // Aguarda para certificar-se de que a lista de modelos foi atualizada.
    await nextTick();

    for (const template of allTemplates.values()) {
        if (template.ok.value !== true) continue;

        if (template.carry > resources) {
            bigger.push(template);
        } else {
            smaller.push(template);
        };
    };

    // Remove os modelos cuja razão entre a quantidade de recursos e a capacidade de carga é menor que o valor definido pelo usuário.
    // Isso impede que sejam enviadas tropas em excesso para a aldeia-alvo.
    // Quanto menor for a razão, maior a quantidade de tropas sendo enviada desnecessariamente.
    // Não é necessário filtrar os modelos com capacidade de carga menor que a quantidade de recursos, pois eles sempre são válidos.
    bigger = bigger.filter((template) => resources / template.carry >= resourceRatio.value);

    return [...smaller, ...bigger];
};

export function pickBestTemplate(templates: PlunderTemplate[]): PlunderTemplate {
    assert(templates.length > 0, 'Não há modelos de saque disponíveis.');
    // Seleciona o modelo com maior capacidade de carga.
    return templates.reduce((prev, curr) => prev.carry > curr.carry ? prev : curr);
};