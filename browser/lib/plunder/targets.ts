import { storeToRefs } from 'pinia';
import { useMutationObserver, useEventListener } from '@vueuse/core';
import { Kronos } from '@tb-dev/kronos';
import { assertInteger } from '$common/guards';
import { calcDistance } from '$common/helpers';
import { parseCoordsFromTextContentStrict, parseGameDate } from '$renderer/utils/parser';
import { PlunderError } from '$browser/error';
import { resources as resourceList } from '$common/constants';
import { useGameDataStore } from '$renderer/stores';
import { assertWallLevel } from '$common/guards';

/** Informações sobre a aldeia-alvo. */
export class PlunderTargetInfo {
    /** ID da aldeia. */
    public readonly id: number;
    /** Data do último ataque contra a aldeia (em milisegundos). */
    public lastAttack: number = 0;
    /** Minutos desde o último ataque. */
    public minutesSince: number = 0;
    /** Indica se há informações obtidas por exploradores. */
    public spyInfo: boolean = false;
    /** Nível da muralha. */
    public wallLevel: WallLevel = 0;
    /** Distância até à aldeia. */
    public distance: number = Infinity;

    /** Coordenadas da aldeia. */
    public coords: Coords = {
        x: 0,
        y: 0
    };

    /** Quantidade de recursos na aldeia. */
    public res: PlunderTableResources = {
        wood: 0,
        stone: 0,
        iron: 0,
        total: 0
    };
    
    /** Botões da tabela. */
    public button: PlunderTableButtons = {
        a: null,
        b: null,
        c: null,
        place: null
    };

    constructor(villageId: number) {
        this.id = villageId;
    };
};

/** Ajuda a controlar o MutationObserver. */
const eventTarget = new EventTarget();

/** Mapa com as informações sobre cada aldeia da tabela. */
export const targets = new Map<string, PlunderTargetInfo>();

/** Retorna uma versão somente leitura do mapa com as informações sobre as aldeias-alvo. */
export function getPlunderTargets() {
    return targets as ReadonlyMap<string, Readonly<PlunderTargetInfo>>;
};

export function queryTargetsInfo() {
    // Desconecta qualquer observer que esteja ativo.
    eventTarget.dispatchEvent(new Event('stop'));

    const gameData = useGameDataStore();
    const { village } = storeToRefs(gameData);

    const plunderListRows = document.queryAsArray('#plunder_list tbody tr[id^="village_"]');
    for (const row of plunderListRows) {
        if (row.hasAttribute('data-tb-village')) continue;
 
        // Registra o ID da aldeia.
        const villageId = row.getAttributeStrict('id').replace(/\D/g, '');
        if (targets.has(villageId)) continue;
        row.setAttribute('data-tb-village', villageId);

        // Objeto onde serão armazenadas as informações sobre a aldeia.
        const info = new PlunderTargetInfo(villageId.toIntegerStrict());

        // Campo de relatório. É usado para calcular a distância até a aldeia-alvo.
        queryReport(row, info, village.value.x, village.value.y);
        // Data do último ataque.
        queryLastAttack(row, info);
        // Quantidade de recursos.
        const resourcesField = queryResourcesField(row, info);
        // Nível da muralha.
        queryWallLevel(resourcesField, info);
        // Botões dos modelos.
        queryTemplateButtons(row, info);
        // Botão da praça de reunião.
        queryPlaceButton(row, info);

        // Armazena os dados obtidos.
        targets.set(villageId, info);
    };

    // Dispara a função novamente caso surjam alterações na tabela.
    const plunderList = document.queryAndAssert<HTMLTableElement>('#plunder_list');
    const options = { subtree: true, childList: true };
    const observer = useMutationObserver(plunderList, () => queryTargetsInfo(), options);

    // Caso a função seja chamada novamente, desconecta o observer ativo.
    useEventListener(eventTarget, 'stop', () => observer.stop(), { once: true });
};

function queryReport(row: Element, info: PlunderTargetInfo, currentX: number | null, currentY: number | null) {
    assertInteger(currentX, `Current village X coordinate is invalid: ${currentX}.`);
    assertInteger(currentY, `Current village Y coordinate is invalid: ${currentY}.`);

    const report = row.queryAndAssert('td a[href*="screen=report"]');
    const coords = parseCoordsFromTextContentStrict(report.textContent);

    info.distance = calcDistance(currentX, currentY, coords[0], coords[1]);
    info.coords.x = coords[0];
    info.coords.y = coords[1];
};

function queryLastAttack(row: Element, info: PlunderTargetInfo) {
    const selector = 'td:not(:has(a)):not(:has(img)):not(:has(span.icon))';
    const fields = row.queryAsArray(selector);
    if (fields.length === 0) {
        throw new PlunderError(`Invalid CSS selector: ${selector}.`);
    };

    for (const field of fields) {
        if (!field.textContent) continue;
        const date = parseGameDate(field.textContent);
        if (date) {
            info.lastAttack = date;
            info.minutesSince = Math.ceil((Date.now() - date) / Kronos.Minute);
            return;
        };
    };

    throw new PlunderError('Could not find last attack date.');
};

/**
 * Verifica se existem informações sobre os recursos disponíveis na aldeia-alvo.
 * Em caso positivo, armazena essas informações na instância pertinente do objeto `PlunderTargetInfo`.
 * @param row Linha da tabela de aldeias.
 * @param info Objeto `PlunderTargetInfo`.
 * @returns O elemento onde estão as informações sobre os recursos, caso elas estejam disponíveis.
 * Do contrário, retorna `null`.
 */
function queryResourcesField(row: Element, info: PlunderTargetInfo): Element | null {
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
        const resAmount = resField.parseIntStrict();
        info.res.total += resAmount;

        const resName = resourceList[index];
        info.res[resName] = resAmount;
    });

    info.spyInfo = true;
    return resourcesField;
};

/**
 * É preciso usar o campo dos recursos como referência para encontrar o nível da muralha.
 * @param resourcesField O elemento onde estão as informações sobre os recursos.
 * @param info Objeto `PlunderTargetInfo`.
 * @returns O nível da muralha.
 */
function queryWallLevel(resourcesField: Element | null, info: PlunderTargetInfo) {
    if (!resourcesField) return;

    const wallLevelField = resourcesField.nextElementSibling;
    if (!wallLevelField) throw new PlunderError('Could not find wall level field.');

    const wallLevel = wallLevelField.parseIntStrict();
    assertWallLevel(wallLevel, PlunderError, 'Found invalid wall level.');

    info.wallLevel = wallLevel;
};

/**
 * Não pode haver emissão de erro caso os botões não forem encontrados.
 * Isso porquê eles naturalmente não estarão presentes caso não haja modelo registrado.
 * @param row Linha da tabela de aldeias.
 * @param info Objeto `PlunderTargetInfo`.
 */
function queryTemplateButtons(row: Element, info: PlunderTargetInfo) {
    info.button.a = row.querySelector<HTMLAnchorElement>('td a[class*="farm_icon_a" i]:not([class*="disabled" i])');      
    info.button.b = row.querySelector<HTMLAnchorElement>('td a[class*="farm_icon_b" i]:not([class*="disabled" i])');
    info.button.c = row.querySelector<HTMLAnchorElement>('td a[class*="farm_icon_c" i][onclick*="farm" i]');

    if (info.button.c) {
        // Verifica se o botão C está desativado.
        const cButtonStatus = info.button.c.getAttributeStrict('class');
        if (cButtonStatus.includes('disabled')) info.button.c = null;
    };
};

/**
 * Encontra o botão da praça de reunião.
 * @param row Linha da tabela de aldeias.
 * @param info Objeto `PlunderTargetInfo`.
 */
function queryPlaceButton(row: Element, info: PlunderTargetInfo) {
    info.button.place = row.queryAndAssert<HTMLAnchorElement>('td a[href*="screen=place" i][onclick]:has(img)');
};