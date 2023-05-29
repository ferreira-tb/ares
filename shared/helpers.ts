import { isInteger, assertGameRegion } from '$shared/guards';
import { GameUrl, GameEndpoints } from '$shared/constants';
import type { AresError } from '$shared/error';

/**
 * Obtém a região referente a um mundo.
 * @throws Se a região obtida não for válida.
 */
export function getRegionFromWorld<T extends typeof AresError>(world: World, SomeError: T, message?: string) {
    const region = world.slice(0, 2);
    assertGameRegion(region, SomeError, message);
    return region;
};

export function getWorldUrl(world: World, region: GameRegion) {
    const url = getGameRegionUrl(region).replace('www', world);
    return new URL(url);
};

function getEndPointUrl(world: World, region: GameRegion, endpoint: keyof typeof GameEndpoints) {
    const { origin } = getWorldUrl(world, region);
    switch (endpoint) {
        case 'GetConfig': return new URL(`${origin}/${GameEndpoints.GetConfig}`);
        case 'GetUnitInfo': return new URL(`${origin}/${GameEndpoints.GetUnitInfo}`);
        case 'Village': return new URL(`${origin}/${GameEndpoints.Village}`);
        default: throw new TypeError(`Invalid endpoint: ${endpoint}.`);
    };
};

export const getWorldConfigUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'GetConfig');
export const getWorldUnitInfoUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'GetUnitInfo');
export const getVillagesDataUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'Village');

export function getGameRegionUrl(region: unknown) {
    switch (region) {
        case 'br': return GameUrl.Brazil;
        case 'en': return GameUrl.Global;
        case 'nl': return GameUrl.Netherlands;
        case 'pt': return GameUrl.Portugal;
        case 'uk': return GameUrl.UnitedKingdom;
        case 'us': return GameUrl.UnitedStates;
        default: return GameUrl.Brazil;
    };
};

/** Calcula distância em campos entre duas coordenadas. */
export function calcDistance(originX: number, originY: number, destX: number, destY: number) {
    return Math.sqrt(((destX - originX) ** 2) + ((destY - originY) ** 2));
};

/** Gera um número inteiro entre dois outros. */
export function generateIntegerBetween(min: number, max: number) {
    return Math.floor((Math.random() * (max - min)) + min);
};

/**
 * Gera um número inteiro aleatório com base em um valor e um intervalo.
 * @param base Valor base.
 * @param range Intervalo.
 */
export function generateRandomDelay(base: number, range?: number) {
    if (!isInteger(range)) range = 50;
    return generateIntegerBetween(base - range, base + range);
};

export function getContinentFromCoords(x: number, y: number, prefix?: string) {
    const a = y.toString(10)[0];
    const b = x.toString(10)[0];
    if (prefix) return `${prefix}${a}${b}`;
    return `${a}${b}`;
};

/**
 * Transforma um número em uma string com o formato de data local.
 * @param raw Número representando a data. Se omitido, utiliza `Date.now()`.
 * @param includeTime Indica se a string resultante deve incluir a hora.
 */
export function getLocaleDateString(raw?: number, includeTime: boolean = false): string {
    if (!isInteger(raw)) raw = Date.now();
    
    const dateObject = new Date(raw);
    const date = dateObject.toLocaleDateString('pt-br', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    if (!includeTime) return date;

    const time = dateObject.toLocaleTimeString('pt-br', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return `${date} ${time}`;
};

export function getPlayerNameFromAlias(alias: UserAlias): string {
    const encodedPlayerName = alias.replace(/^[a-z]+\d+__USERID__/, '');
    return decodeURIComponent(encodedPlayerName);
};