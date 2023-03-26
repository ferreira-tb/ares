import { computed, nextTick } from 'vue';
import { ipcRenderer } from 'electron';
import { assert, isKeyOf, assertInteger, toIntegerStrict, isInteger } from '@tb-dev/ts-guard';
import { assertElement, DOMAssertionError } from '@tb-dev/ts-guard-dom';
import { usePlunderConfigStore } from '$vue/stores/plunder';
import { useUnitsStore } from '$vue/stores/units';
import { assertFarmUnit } from '$global/utils/guards';
import { PlunderError } from '$browser/error';
import { ipcInvoke } from '$global/ipc';
import type { FarmUnits, FarmUnitsAmount, UnitAmount } from '$types/game';
import type { PlunderTargetInfo } from '$lib/plunder/villages';
import type { CustomPlunderTemplateType } from '$types/plunder';
import type { UserAlias } from '$types/electron';

type ConfigReturnType = ReturnType<typeof usePlunderConfigStore>;

class TemplateUnits implements FarmUnitsAmount {
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

export class PlunderTemplate {
    /** Tipo do modelo. */
    readonly type: string;
    /** Quantidade de tropas no modelo. */
    readonly units: FarmUnitsAmount;
    /** Alias do criador do modelo. Somente válido para modelos personalizados. */
    readonly alias: UserAlias | null;

    constructor(type: string, alias: UserAlias | null = null) {
        this.type = type;
        this.units = new TemplateUnits();
        this.alias = alias;
    };

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

    /** 
     * Sempre que o modelo C é usado, a quantidade de tropas no template é atualizada.
     * No entanto, o próximo ataque usando o modelo C usará uma quantidade diferente de tropas.
     * Por isso, é necessário resetar o template para que ele possa ser usado novamente.
     */
    public reset() {
        if (this.type !== 'c') return;
        for (const key of Object.keys(this.units) as FarmUnits[]) {
            this.units[key] = 0;
        };
    }
};

/** Representa todos os modelos de saque. */
const allTemplates = new Map<string, PlunderTemplate>();
ipcRenderer.on('custom-plunder-template-saved', async (_e, template: CustomPlunderTemplateType) => {
    const plunderTemplate = await parseCustomPlunderTemplate(template);
    allTemplates.set(plunderTemplate.type, plunderTemplate);
});

ipcRenderer.on('custom-plunder-template-destroyed', (_e, template: CustomPlunderTemplateType) => {
    const templateInMap = allTemplates.get(template.type);
    if (templateInMap && templateInMap.alias === template.alias) {
        allTemplates.delete(templateInMap.type);
    };
});

/** Obtêm informações sobre os modelos de saque. */
export async function queryTemplateData() {
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

    // Cria um modelo vazio para o tipo 'C'.
    const templateC = new PlunderTemplate('c');
    allTemplates.set(templateC.type, templateC);

    // Obtêm os modelos personalizados.
    const customTemplates = await ipcInvoke('get-custom-plunder-templates');
    if (Array.isArray(customTemplates)) {
        for (const template of customTemplates) {
            const plunderTemplate = await parseCustomPlunderTemplate(template);
            allTemplates.set(plunderTemplate.type, plunderTemplate);
        };
    };
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

        assertFarmUnit(unitType, PlunderError, `${unitType} não é uma unidade válida.`);
        field.setAttribute(`data-tb-template-${row}`, unitType);

        /** Contém a quantidade de unidades. */
        template.units[unitType] = field.getAttributeAsIntStrict('value');
    };
};

/**
 * Filtra todos os modelos de saque disponíveis de acordo com a quantidade de recursos na aldeia-alvo.
 * Caso a função retorne uma lista vazia, o ataque não deve ser enviado.
 * 
 * Se a opção `blindAttack` estiver ativada, todos os modelos com tropas disponíveis são retornados.
 * @param info - Informações sobre a aldeia-alvo.
 * @param config - Configurações do assistente de saque.
 * @see https://github.com/ferreira-tb/ares/issues/68
 * @see https://github.com/ferreira-tb/ares/issues/69
 */
async function filterTemplates(info: PlunderTargetInfo, config: ConfigReturnType): Promise<PlunderTemplate[]> {
    // Separa os modelos em dois grupos, de acordo com sua capacidade de carga.
    // Os modelos com capacidade de carga maior que a quantidade de recursos são colocados no grupo `bigger`.
    // Os demais são colocados no grupo `smaller`.
    let bigger: PlunderTemplate[] = [];
    const smaller: PlunderTemplate[] = [];

    // Aguarda para certificar-se de que a lista de modelos foi atualizada.
    await nextTick();

    const resources = info.res.total;
    for (const template of allTemplates.values()) {
        if (
            template.carry === 0 ||
            template.ok.value !== true ||
            template.type === 'c' ||
            (template.type === 'a' && info.button.a === null) ||
            (template.type === 'b' && info.button.b === null)
        ) {
            continue;
        };

        if (template.carry > resources) {
            bigger.push(template);
        } else {
            smaller.push(template);
        };
    };

    // Retorna sem filtrar se a opção `blindAttack` estiver ativada.
    if (config.blindAttack === true && info.spyInfo === false) {
        return [...smaller, ...bigger];
    };

    // Remove os modelos cuja razão entre a quantidade de recursos e a capacidade de carga é menor que o valor definido pelo usuário.
    // Isso impede que sejam enviadas tropas em excesso para a aldeia-alvo.
    // Quanto menor for a razão, maior a quantidade de tropas sendo enviada desnecessariamente.
    // Não é necessário filtrar os modelos com capacidade de carga menor que a quantidade de recursos, pois eles sempre são válidos.
    bigger = bigger.filter((template) => resources / template.carry >= config.resourceRatio);
    return [...smaller, ...bigger];
};

export async function pickBestTemplate(info: PlunderTargetInfo): Promise<PlunderTemplate | null> {
    const config = usePlunderConfigStore();

    if (config.useC === true) {
        const templateC = await getTemplateC(info);
        if (templateC !== null) return templateC;
        if (templateC === null && config.useCPattern === 'only') return null;
    };

    const templates = await filterTemplates(info, config);
    if (templates.length === 0) return null;

    if (
        info.spyInfo === false &&
        config.blindAttack === true &&
        config.blindAttackPattern === 'smaller'
    ) {
        // Se a opção `blindAttack` estiver ativada e o padrão de seleção for `smaller`,
        // seleciona o modelo com menor capacidade de carga.
        return templates.reduce((prev, curr) => prev.carry < curr.carry ? prev : curr);
    };

    // Do contrário, apenas seleciona o modelo com maior capacidade de carga.
    return templates.reduce((prev, curr) => prev.carry > curr.carry ? prev : curr);
};

async function getTemplateC(info: PlunderTargetInfo): Promise<PlunderTemplate | null> {
    try {
        assertElement(info.button.c, 'Não foi possível encontrar o botão de ataque do modelo C.');
        const json = info.button.c.getAttributeStrict('data-units-forecast');
        const cUnits = JSON.parse(json) as UnitAmount;
        const templateC = allTemplates.getStrict('c');

        // Atualiza a quantidade de tropas disponíveis no modelo C.
        for (const unit in cUnits) {
            if (!isKeyOf(unit, templateC.units)) continue;

            // De maneira completamente aleatória, o jogo às vezes retorna uma string em vez de um número no JSON.
            // Por isso, é necessário garantir que o valor seja um número inteiro.
            templateC.units[unit] = toIntegerStrict(cUnits[unit], isInteger);
        };

        if (Object.values(templateC.units).every((amount) => amount === 0)) return null;

        // Atualiza a capacidade de carga do modelo C.
        const carry = await ipcInvoke('calc-carry-capacity', templateC.units);
        assertInteger(carry, 'A capacidade de carga do modelo C não é um número inteiro.');
        templateC.carry = carry;

        await nextTick();
        return templateC.ok.value === true ? templateC : null;

    } catch (err) {
        if (err instanceof DOMAssertionError) throw err;
        PlunderError.catch(err);
        return null;
    };
};

async function parseCustomPlunderTemplate(template: CustomPlunderTemplateType): Promise<PlunderTemplate> {
    const plunderTemplate = new PlunderTemplate(template.type, template.alias);

    for (const [unit, amount] of Object.entries(template.units) as [FarmUnits, number][]) {
        assertFarmUnit(unit, PlunderError, `${unit} não é uma unidade válida.`);
        assertInteger(amount, `${amount} não é um número inteiro.`);
        plunderTemplate.units[unit] = amount;
    };

    const carry = await ipcInvoke('calc-carry-capacity', plunderTemplate.units);
    assertInteger(carry, `A capacidade de carga do modelo ${template.type} não é um número inteiro.`);
    plunderTemplate.carry = carry;

    return plunderTemplate;
};