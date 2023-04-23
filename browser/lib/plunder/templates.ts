import { computed, nextTick, ref } from 'vue';
import { ipcRenderer } from 'electron';
import { assertInteger, isInteger } from '$global/guards';
import { useUnitsStore } from '$renderer/stores/units';
import { assertFarmUnit } from '$global/guards';
import { Kronos } from '$global/constants';
import { PlunderError } from '$browser/error';
import { ipcInvoke } from '$renderer/ipc';
import type { usePlunderConfigStore } from '$renderer/stores/plunder';
import type { FarmUnits, FarmUnitsAmount, UserAlias } from '$types/game';
import type { PlunderTargetInfo } from '$browser/lib/plunder/targets';
import type { CustomPlunderTemplateType } from '$types/plunder';

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
    /** Alias do criador do modelo. Somente válido para modelos personalizados. */
    readonly alias: UserAlias | null;
    /** Quantidade de tropas no modelo. */
    readonly units = new TemplateUnits();

    constructor(type: string, alias: UserAlias | null = null) {
        this.type = type;
        this.alias = alias;
    };

    /** Capacidade de carga. */
    readonly carry = ref(0);
    
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

/** Retorna uma versão somente leitura do mapa de modelos de saque. */
export function getAllTemplates() {
    return allTemplates as ReadonlyMap<string, Readonly<PlunderTemplate>>;
};

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
    if (aFields.length < 7) {
        throw new PlunderError(`Could not find all text fields for template A: ${aFields.length} found.`);
    };
    parseUnitAmount('a', aFields);

    const aCarryField = aRow.queryAndAssert('td:not(:has(input[data-tb-template-a])):not(:has(input[type*="hidden"]))');
    templateA.carry.value = aCarryField.parseIntStrict();

    // Campos do modelo B.
    const bRow = table.queryAndAssert('tr:nth-of-type(4):has(td input[type="text"][name^="spear" i])');
    const bFields = bRow.queryAsArray('td input[type="text"][name]');
    if (bFields.length < 7) {
        throw new PlunderError(`Could not find all text fields for template B: ${bFields.length} found.`);
    }; 
    parseUnitAmount('b', bFields);

    const bCarryField = bRow.queryAndAssert('td:not(:has(input[data-tb-template-b])):not(:has(input[type*="hidden"]))');
    templateB.carry.value = bCarryField.parseIntStrict();

    // Cria um modelo vazio para o tipo 'C'.
    const templateC = new PlunderTemplate('c');
    allTemplates.set(templateC.type, templateC);

    // Obtêm os modelos personalizados.
    const customTemplates = await ipcInvoke('plunder:get-custom-templates');
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
    const template = allTemplates.getStrict(row);
    for (const field of fields) {
        /** O atributo `name` é usado para determinar a unidade referente ao campo. */
        const fieldName = field.getAttributeStrict('name');
        /** O valor no atributo `name` é algo como `spear[11811]`. */
        const unitType = fieldName.replace(/\[\d+\]/g, '');

        assertFarmUnit(unitType, PlunderError, `${unitType} is not a valid farm unit.`);
        field.setAttribute(`data-tb-template-${row}`, unitType);

        /** Contém a quantidade de unidades. */
        template.units[unitType] = field.getAttributeAsIntStrict('value');
    };
};

/**
 * Calcula a razão entre a quantidade de recursos na aldeia-alvo e a capacidade de carga do modelo.
 * @param resources Recursos na aldeia-alvo.
 * @param template Modelo atacante.
 */
function calcResourceRatio(resources: number, template: PlunderTemplate) {
    return resources / template.carry.value;
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
async function filterTemplates(info: PlunderTargetInfo, config: ReturnType<typeof usePlunderConfigStore>) {
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
            template.carry.value === 0 ||
            !template.ok.value ||
            template.type === 'c' ||
            (template.type === 'a' && !info.button.a) ||
            (template.type === 'b' && !info.button.b)
        ) {
            continue;
        };

        if (template.carry.value > resources) {
            bigger.push(template);
        } else {
            smaller.push(template);
        };
    };

    // Retorna sem filtrar se a opção `blindAttack` estiver ativada.
    if (config.blindAttack && !info.spyInfo) {
        return [...smaller, ...bigger];
    };

    // Remove os modelos cuja razão entre a quantidade de recursos e a capacidade de carga é menor que o valor definido pelo usuário.
    // Isso impede que sejam enviadas tropas em excesso para a aldeia-alvo.
    // Quanto menor for a razão, maior a quantidade de tropas sendo enviada desnecessariamente.
    // Não é necessário filtrar os modelos com capacidade de carga menor que a quantidade de recursos, pois eles sempre são válidos.
    bigger = bigger.filter((template) => calcResourceRatio(resources, template) >= config.resourceRatio);
    return [...smaller, ...bigger];
};

export async function pickBestTemplate(info: PlunderTargetInfo, config: ReturnType<typeof usePlunderConfigStore>) {
    if (config.useC && config.useCPattern !== 'excess') {
        const templateC = await getTemplateC(info, config);
        if (templateC) return templateC;

        // Se não for possível usar o modelo C, retorna sem enviar o ataque se o padrão de uso for `only`.
        if (config.useCPattern === 'only') return null;
    };

    const templates = await filterTemplates(info, config);
    if (templates.length === 0) return null;

    if (
        !info.spyInfo &&
        config.blindAttack &&
        config.blindAttackPattern === 'smaller'
    ) {
        // Se não houver informações sobre os recursos, a opção `blindAttack` estiver ativada
        // e o padrão de seleção for `smaller`, seleciona o modelo com menor capacidade de carga.
        return templates.reduce((prev, curr) => prev.carry < curr.carry ? prev : curr);
    };

    // Do contrário, apenas seleciona o modelo com maior capacidade de carga.
    const best = templates.reduce((prev, curr) => prev.carry > curr.carry ? prev : curr);

    if (
        config.useC &&
        config.useCPattern === 'excess' &&
        calcResourceRatio(info.res.total, best) > config.useCWhenResourceRatioIsBiggerThan
    ) {
        const templateC = await getTemplateC(info, config);
        if (templateC) return templateC;
    };

    return best;
};

async function getTemplateC<T extends keyof TemplateUnits>(
    info: PlunderTargetInfo,
    config: ReturnType<typeof usePlunderConfigStore>
) {
    try {
        const button = info.button.c;
        if (!button) return null;

        if (info.distance > config.maxDistanceC) return null;
        if ((Date.now() - info.lastAttack) > config.ignoreOlderThanC * Kronos.Hour) return null;

        const json = button.getAttributeStrict('data-units-forecast');
        const cUnits = JSON.parse(json) as TemplateUnits;
        const templateC = allTemplates.getStrict('c');

        // Atualiza a quantidade de tropas disponíveis no modelo C.
        for (const [unit, amount] of Object.entries(cUnits) as [T, number | string][]) {
            if (unit in templateC.units) {
                // De maneira completamente aleatória, o jogo às vezes retorna uma string em vez de um número no JSON.
                // Por isso, é necessário garantir que o valor seja um número inteiro.
                templateC.units[unit] = isInteger(amount) ? amount : Number.parseIntStrict(amount);
            };
        };

        await nextTick();
        if (Object.values(templateC.units).every((amount) => amount === 0)) return null;

        if (!templateC.ok.value) {
            const unitStore = useUnitsStore();
            for (const [unit, amount] of Object.entries({ ...templateC.units }) as [FarmUnits, number][]) {
                if (amount === 0 || unit === 'spy') continue;
                templateC.units[unit] = unitStore[unit];
            };
        };

        await nextTick();
        if (!templateC.ok.value) return null;

        templateC.carry.value = await calcCarryCapacity({ ...templateC.units });
        return templateC;

    } catch (err) {
        PlunderError.catch(err);
        return null;
    };
};

async function calcCarryCapacity(units: TemplateUnits) {
    const carry = await ipcInvoke('plunder:calc-carry-capacity', units);
    assertInteger(carry, `Expected carry capacity to be an integer, but got ${carry}.`);
    return carry;
};

async function parseCustomPlunderTemplate(template: CustomPlunderTemplateType) {
    const plunderTemplate = new PlunderTemplate(template.type, template.alias);

    for (const [unit, amount] of Object.entries(template.units) as [FarmUnits, number][]) {
        assertFarmUnit(unit, PlunderError, `${unit} is not a valid farm unit.`);
        assertInteger(amount, `Expected ${unit} amount to be an integer, but got ${amount}.`);
        plunderTemplate.units[unit] = amount;
    };

    plunderTemplate.carry.value = await calcCarryCapacity(plunderTemplate.units);

    await nextTick();
    return plunderTemplate;
};