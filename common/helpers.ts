import { assertGameRegion } from '$common/guards';
import { GameUrl, GameEndpoints } from '$common/constants';
import { aliasRegex } from '$common/regex';
import type { AresError } from '$common/error';

export function decodeString(str: string) {
    return decodeURIComponent(str.replace(/\+/g, ' '));
};

/**
 * Obtém a região referente a um mundo.
 * @throws Se a região obtida não for válida.
 */
export function getRegionFromWorld<T extends typeof AresError>(world: World, SomeError: T) {
    const region = world.slice(0, 2);
    assertGameRegion(region, SomeError, `Could not get region from world: ${world}.`);
    return region;
};

export function getWorldUrl(world: World, region: GameRegion) {
    const url = getGameRegionUrl(region).replace('www', world);
    return new URL(url);
};

function getEndPointUrl(world: World, region: GameRegion, endpoint: keyof typeof GameEndpoints) {
    const { origin } = getWorldUrl(world, region);
    const url = (e: GameEndpoints) => new URL(`${origin}/${e}`);
    switch (endpoint) {
        case 'GetConfig': return url(GameEndpoints.GetConfig);
        case 'GetUnitInfo': return url(GameEndpoints.GetUnitInfo);
        case 'Ally': return url(GameEndpoints.Ally);
        case 'Conquer': return url(GameEndpoints.Conquer);
        case 'Player': return url(GameEndpoints.Player);
        case 'Village': return url(GameEndpoints.Village);
        default: throw new TypeError(`Invalid endpoint: ${endpoint}.`);
    };
};

export const getWorldConfigUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'GetConfig');
export const getWorldUnitInfoUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'GetUnitInfo');
export const getAllyDataUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'Ally');
export const getConquerDataUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'Conquer');
export const getPlayerDataUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'Player');
export const getVillageDataUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'Village');

export function getGameRegionUrl(region: unknown): GameUrl {
    if (typeof region !== 'string') return GameUrl.Brazil;
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
    if (typeof range !== 'number' || !Number.isInteger(range)) range = 50;
    return generateIntegerBetween(base - range, base + range);
};

export function getContinentFromCoords(x: number, y: number, prefix?: string) {
    const a = y.toString(10)[0];
    const b = x.toString(10)[0];
    if (prefix) return `${prefix}${a}${b}`;
    return `${a}${b}`;
};

/**
 * Obtém o nome do jogador a partir do alias, decodificando-o.
 * @param userAlias Alias do jogador.
 */
export function getPlayerNameFromAlias(userAlias: UserAlias): string {
    const encodedPlayerName = userAlias.replace(aliasRegex, '');
    return decodeURIComponent(encodedPlayerName);
};