import { computed, inject, reactive, ref, watchSyncEffect } from 'vue';
import { assert } from '#/error.js';
import { units } from '$/farm/units.js';
import { farmUnits } from '#/constants.js';
import { PlunderAttack } from '$/farm/attack.js';
import { predict } from '$/farm/prediction.js';
import type { FarmUnits } from '@/game.js';
import type { PlunderVillageInfo } from '$/farm/villages';

export class PlunderTemplate {
    /** Tipo do modelo. */
    readonly type: string;
    /** Capacidade de carga. */
    carry = 0;
    /** Indica se há tropas o suficiente para o modelo ser usado. */
    ok = computed(() => {
        for (const [key, value] of Object.entries(units) as [keyof typeof units, number][]) {
            if (key === 'ram') continue;
            if (value < this.units[key]) return false;
        };

        return true;
    });

    units = reactive({
        spear: 0,
        sword: 0,
        axe: 0,
        spy: 0,
        light: 0,
        heavy: 0,
        knight: 0,
        archer: 0,
        marcher: 0
    });

    constructor(type: string) {
        this.type = type;
    };
};

const templateA = new PlunderTemplate('a');
const templateB = new PlunderTemplate('b');

/** Representa o total de recursos disponíveis na aldeia-alvo. */
export const resources = ref<number>(0);
const bestTemplate = ref<PlunderTemplate | null>(null);
const otherTemplate = ref<PlunderTemplate | null>(null);

/** Obtêm informações sobre os modelos de saque. */
export function queryTemplateData() {
    // Corpo da tabela com os modelos do assistente de saque.
    const table = document.queryAndAssert('#content_value form tbody:has(td input[type="text"][name^="spear" i])');

    // Campos do modelo A.
    const aRow = table.queryAndAssert('tr:nth-of-type(2):has(td input[type="text"][name^="spear" i])');
    const aFields = aRow.queryAsArray('td input[type="text"][name]');
    assert(aFields.length >= 7, 'Não foi possível encontrar os campos de texto do modelo A.');
    parseUnitAmount('a', aFields);

    const aCarryField = aRow.queryAndAssert('td:not(:has(input[data-tb-template-a])):not(:has(input[type*="hidden"]))');
    templateA.carry = aCarryField.parseInt();

    // Campos do modelo B.
    const bRow = table.queryAndAssert('tr:nth-of-type(4):has(td input[type="text"][name^="spear" i])');
    const bFields = bRow.queryAsArray('td input[type="text"][name]');
    assert(bFields.length >= 7, 'Não foi possível encontrar os campos de texto do modelo B.');
    parseUnitAmount('b', bFields);

    const bCarryField = bRow.queryAndAssert('td:not(:has(input[data-tb-template-b])):not(:has(input[type*="hidden"]))');
    templateB.carry = bCarryField.parseInt();
};

/**
 * Analisa o conteúdo da linha para determinar a quantidade de tropas disponíveis.
 * Em seguida, guarda as informações nos respectivos modelos.
 * @param row Identificador da linha.
 * @param fields Campos da linha.
 */
function parseUnitAmount(row: 'a' | 'b', fields: Element[]) {
    const template = row === 'a' ? templateA : templateB;
    const verify = (unit: string): unit is FarmUnits => farmUnits.includes(unit as FarmUnits);

    for (const field of fields) {
        /** O atributo `name` é usado para determinar a unidade referente ao campo. */
        const fieldName = field.assertAttribute('name');
        /** O valor no atributo `name` é algo como `spear[11811]`. */
        const unitType = fieldName.replace(/\[\d+\]/g, '');

        assert(verify(unitType), `${unitType} não é uma unidade válida.`);
        field.setAttribute(`data-tb-template-${row}`, unitType);
        
        /** Contém a quantidade de unidades. */
        template.units[unitType] = field.assertAttributeAsInt('value');
    };
};

/** Filtra todos os modelos, retornando apenas aqueles que possuem tropas disponíveis para atacar. */
function filterAvailableTemplates() {
    const templates: PlunderTemplate[] = [templateA, templateB];
    return templates.filter((template) => template.ok.value);
};

/**
 * 
 * @param resources Quantidade de recursos que se espera ter na aldeia.
 * @param attacks 
 */
function pickBestAttack(resources: number, attacks: PlunderAttack[]): PlunderAttack | null {
    // attacks.sort((a, b) => b.loot - a.loot);
    const moreThan = [];
    const lessThan = [];

    for (const attack of attacks) {
        if (attack.loot >= resources) moreThan.push(attack);
        if (attack.loot < resources) lessThan.push(attack);
    };
};

export async function chooseBestTemplate(villageInfo: PlunderVillageInfo) {
    const templates = filterAvailableTemplates();
    if (templates.length === 0) return null;

    const attacks: PlunderAttack[] = [];
    const canPredict = inject<boolean>('can-predict', false);
    
    for (const template of templates) {
        let attack: PlunderAttack;

        // Se for possível fazer previsões, o modelo será selecionado com base no resultado delas.
        if (canPredict === true) {
            const prediction = await predict(template.carry, villageInfo);
            attack = new PlunderAttack(template.type, prediction);

        // Do contrário assumirá que todos os modelos conseguirão saquear o máximo possível.
        } else {
            attack = new PlunderAttack(template.type, template.carry);
        };

        attacks.push(attack);
    };

    return pickBestAttack(villageInfo.res.total, attacks);
};

watchSyncEffect(() => {
    const bigger = templateA.carry >= templateB.carry ? templateA : templateB;
    const smaller = templateA.carry < templateB.carry ? templateA : templateB;

    // Se ambos são menores que a quantidade de recursos, o maior entre eles prevalecerá.
    // A diferença entre a carga do maior e a quantidade de recursos não é relevante nesse caso.
    if (resources.value >= bigger.carry) {
        bestTemplate.value = bigger;
        otherTemplate.value = smaller;

    // Se os dois são maiores, descartam-se aqueles que estejam fora da zona aceitável.
    // Se todos forem descartados, não haverá ataque.
    } else if (resources.value <= smaller.carry) {
        bestTemplate.value = resources.value / smaller.carry >= 0.8 ? smaller : null;
        otherTemplate.value = resources.value / bigger.carry >= 0.8 ? bigger : null;

    // Nesse caso, a quantidade de recursos é maior que a carga de um, mas menor que a de outro.
    } else {
        // Razão em relação ao maior (será sempre MENOR que 1).
        const ratioBigger = resources.value / bigger.carry;
        // Razão em relação ao menor (será sempre MAIOR que 1).
        const ratioSmaller = resources.value / smaller.carry;

        // O de maior carga é descartado caso seja grande demais.
        // O menor é dado como válido pois valores menores são sempre adequados.
        if (ratioBigger < 0.8) {
            bestTemplate.value = smaller;
            otherTemplate.value = null;

        // Caso o maior seja válido, verifica-se qual está mais próximo da quantidade de recursos.
        } else {
            bestTemplate.value = (1 - ratioBigger) <= (ratioSmaller - 1) ? bigger : smaller;
            otherTemplate.value = (1 - ratioBigger) > (ratioSmaller - 1) ? bigger : smaller;
        };
    };
});