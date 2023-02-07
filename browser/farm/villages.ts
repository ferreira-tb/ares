import { calcDistance } from '#/vue/helpers.js';
import { parseCoordsFromTextContent, parseGameDate } from '#/helpers.js';
import { assert, assertDOM, assertElement, assertType, ClaustrophobicError } from '#/error.js';
import { resources as resourceList } from '#/constants.js';
import { ipcSend } from '#/ipc.js';

export class PlunderVillageInfo {
    /** Data do último ataque contra a aldeia. */
    lastAttack: number = 0;
    /** Indica se há informações obtidas por exploradores. */
    spyInfo: boolean = false;
    /** Nível da muralha. */
    wallLevel: number = 0;
    /** Distância até à aldeia. */
    distance: number = Infinity;

    /** Estimativa da quantidade de madeira disponível na aldeia. */
    wood: number = 0;
    /** Estimativa da quantidade de argila disponível na aldeia. */
    stone: number = 0;
    /** Estimativa da quantidade de ferro disponível na aldeia. */
    iron: number = 0;
    /** Total de recursos que se espera ter na aldeia. */
    total: number = 0;

    /** Botão A do assistente de saque. */
    a: HTMLAnchorElement | null = null;
    /** Botão B do assistente de saque. */
    b: HTMLAnchorElement | null = null;
    /** Botão C do assistente de saque. */
    c: HTMLAnchorElement | null = null;
    /** Botão para abrir a janela de comandos no assistente de saque. */
    place: HTMLAnchorElement | null = null;

    /** Indica se o botão C está ativo ou não. */
    cStatus: boolean = true;
};

/** Ajuda a controlar o MutationObserver. */
const eventTarget = new EventTarget();

/** Mapa com as informações sobre cada aldeia da tabela. */
export const villagesInfo: Map<string, PlunderVillageInfo> = new Map();

export function queryVillagesInfo() {
    // Desconecta qualquer observer que esteja ativo.
    eventTarget.dispatchEvent(new Event('stop'));

    const plunderListRows = document.queryAsArray('#plunder_list tbody tr[id^="village_"]');
    for (const row of plunderListRows) {
        if (row.hasAttribute('data-tb-village')) continue;
 
        const villageId = row.assertAttribute('id').replace(/\D/g, '');

        // Facilita o acesso ao id da aldeia.
        row.setAttribute('data-tb-village', villageId);

        // Objeto onde serão armazenadas as informações sobre a aldeia.
        const info = new PlunderVillageInfo();

        // Campo de relatório. É usado para calcular a distância até a aldeia-alvo.
        queryReport(row, info);
        // Data do último ataque.
        queryLastAttack(row, info);
        // Quantidade de recursos.
        const resourcesField = queryResourcesField(row, info);
        // Nível da muralha.
        queryWallLevel(resourcesField, info);
        // Botões dos modelos.
        queryModelButtons(row, info);
        // Botão da praça de reunião.
        queryPlaceButton(row, info);

        // Armazena os dados obtidos.
        villagesInfo.set(villageId, info);
    };

    // Dispara a função novamente caso surjam alterações na tabela.
    const plunderList = document.queryAndAssert('#plunder_list');
    const observeTable = new MutationObserver(() => queryVillagesInfo());
    observeTable.observe(plunderList, { subtree: true, childList: true });

    // Caso a função seja chamada novamente, desconecta o observer ativo.
    eventTarget.addEventListener('stop', () => observeTable.disconnect(), { once: true });
};

function queryReport(row: Element, info: PlunderVillageInfo) {
    const report = row.queryAndAssert('td a[href*="screen=report"]');
    const coords = parseCoordsFromTextContent(report.textContent);
    assertType(Array.isArray(coords), 'O valor obtido para as coordenadas da aldeia-alvo não é uma array.');
    info.distance = calcDistance(coords[0], coords[1]);

    // Envia a URL do relatório para o processo principal.
    // Ela será eventualmente usada para atualizar o banco de dados do Deimos.
    const hrefAttr = report.assertAttribute('href');
    const reportUrl = new URL(hrefAttr, location.origin);
    ipcSend('add-deimos-report-url', reportUrl.href);
};

function queryLastAttack(row: Element, info: PlunderVillageInfo) {
    const fields = row.queryAsArray('td:not(:has(a)):not(:has(img)):not(:has(span.icon))');
    assertDOM(fields.length >= 1, 'td:not(:has(a)):not(:has(img)):not(:has(span.icon))');

    for (const field of fields) {
        if (!field.textContent) continue;
        const date = parseGameDate(field.textContent);
        if (date) {
            info.lastAttack = date;
            return;
        };
    };

    throw new ClaustrophobicError('Não foi possível determinar a data do último ataque');
};

/**
 * Verifica se existem informações sobre os recursos disponíveis na aldeia-alvo.
 * Em caso positivo, armazena essas informações na instância pertinente do objeto `PlunderVillageInfo`.
 * @param row Linha da tabela de aldeias.
 * @param info Objeto `PlunderVillageInfo`.
 * @returns O elemento onde estão as informações sobre os recursos, caso elas estejam disponíveis.
 * Do contrário, retorna `null`.
 */
function queryResourcesField(row: Element, info: PlunderVillageInfo): Element | null {
    // A não existência desse campo poder indicar que não há informações obtidas por exploradores.
    const resourcesField = row.querySelector('td:has(span > span.icon.wood)');
    if (!resourcesField) {
        // É preciso verificar se é realmente esse o caso.
        row.queryAndAssert('span[data-title*="explorador" i]');
        info.spyInfo = false;
        return null;
    };

    const woodField = resourcesField.queryAndAssert('span span[class*="wood" i] + span');
    const stoneField = resourcesField.queryAndAssert('span span[class*="stone" i] + span');
    const ironField = resourcesField.queryAndAssert('span span[class*="iron" i] + span');

    [woodField, stoneField, ironField].forEach((resField, index) => {
        // Adiciona o valor à quantia total.
        const resAmount = resField.parseInt();
        info.total += resAmount;

        const resName = resourceList[index];
        info[resName] = resAmount;
    });

    info.spyInfo = true;
    return resourcesField;
};

/**
 * É preciso usar o campo dos recursos como referência para encontrar o nível da muralha.
 * @param resourcesField O elemento onde estão as informações sobre os recursos.
 * @param info Objeto `PlunderVillageInfo`.
 * @returns O nível da muralha.
 */
function queryWallLevel(resourcesField: Element | null, info: PlunderVillageInfo) {
    if (resourcesField === null) return;

    const wallLevelField = resourcesField.nextElementSibling;
    assertElement(wallLevelField, 'O campo com o nível da muralha não foi encontrado');

    const wallLevel = wallLevelField.parseInt();
    const errorMessage = 'O valor encontrado não corresponde ao nível da muralha';
    assert(wallLevel >= 0, errorMessage);
    assert(wallLevel <= 20, errorMessage);

    info.wallLevel = wallLevel;
};

/**
 * Não pode haver emissão de erro caso os botões não forem encontrados.
 * Isso porquê eles naturalmente não estarão presentes caso não haja modelo registrado.
 * @param row Linha da tabela de aldeias.
 * @param info Objeto `PlunderVillageInfo`.
 */
function queryModelButtons(row: Element, info: PlunderVillageInfo) {
    info.a = row.querySelector<HTMLAnchorElement>('td a[class*="farm_icon_a" i]:not([class*="disabled" i])');      
    info.b = row.querySelector<HTMLAnchorElement>('td a[class*="farm_icon_b" i]:not([class*="disabled" i])');
    info.c = row.querySelector<HTMLAnchorElement>('td a[class*="farm_icon_c" i][onclick*="farm" i]');

    if (info.c) {
        // Verifica se o botão C está desativado.
        const cButtonStatus = info.c.assertAttribute('class');
        if (cButtonStatus.includes('disabled')) info.cStatus = false;
    };
};

/**
 * Encontra o botão da praça de reunião.
 * @param row Linha da tabela de aldeias.
 * @param info Objeto `PlunderVillageInfo`.
 */
function queryPlaceButton(row: Element, info: PlunderVillageInfo) {
    info.place = row.queryAndAssert<HTMLAnchorElement>('td a[href*="screen=place" i][onclick]:has(img)');
};