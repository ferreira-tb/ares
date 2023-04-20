import { isInteger } from '$global/guards';
import { GameUrl, GameEndpoints } from '$global/constants';
import type { GameRegion, World } from '$types/game';
import type { UserAlias } from '$types/electron';

export function getWorldUrl(world: World, region: GameRegion) {
    const url = getGameRegionUrl(region).replace('www', world);
    return new URL(url);
};

export function getWorldConfigUrl(world: World, region: GameRegion) {
    const { origin } = getWorldUrl(world, region);
    return new URL(`${origin}/${GameEndpoints.GetConfig}`);
};

export function getWorldUnitUrl(world: World, region: GameRegion) {
    const { origin } = getWorldUrl(world, region);
    return new URL(`${origin}/${GameEndpoints.GetUnitInfo}`);
};

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