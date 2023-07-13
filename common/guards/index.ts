import { isString } from 'lodash-es';
import { plunderUnits, allUnits } from '$common/enum';
import { aliasRegex, allowedOriginRegexList, regionRegex, worldRegex } from '$common/regex';
import type { PlunderUnits } from '$common/templates';

export function isAllowedOrigin(url: string): boolean {
    const { origin } = new URL(url);
    return allowedOriginRegexList.some((regex) => regex.test(origin));
}

export const isGameRegion = (region: unknown): region is GameRegion => (isString(region) && regionRegex.test(region));
export function assertGameRegion(region: unknown, message?: string): asserts region is GameRegion {
    if (!message) message = `Invalid game region: ${String(region)}`;
    if (!isGameRegion(region)) throw new TypeError(message);
}

/** Verifica se o valor passado é um nome válido de unidade usada para saque. */
export const isPlunderUnit = (unit: unknown): unit is keyof PlunderUnits => plunderUnits.includes(unit as keyof PlunderUnits);
export function assertPlunderUnit(unit: unknown, message?: string): asserts unit is PlunderUnits {
    if (!message) message = `Invalid plunder unit: ${String(unit)}`;
    if (!isPlunderUnit(unit)) throw new TypeError(message);
}

/** Verifica se o valor passado é um nome válido de unidade. */
export const isUnit = (unit: unknown): unit is AllUnits => allUnits.includes(unit as AllUnits);
export function assertUnit(unit: unknown, message?: string): asserts unit is AllUnits {
    if (!message) message = `Invalid unit: ${String(unit)}`;
    if (!isUnit(unit)) throw new TypeError(message);
}

export const isUserAlias = (alias: unknown): alias is UserAlias => (isString(alias) && aliasRegex.test(alias));
export function assertUserAlias(alias: unknown, message?: string): asserts alias is UserAlias {
    if (!isUserAlias(alias)) {
        if (!message) message = `Invalid user alias: ${String(alias)}`;
        throw new TypeError(message);
    }
}

export const isWorld = (world: unknown): world is World => (isString(world) && worldRegex.test(world));
export function assertWorld(world: unknown, message?: string): asserts world is World {
    if (!message) message = `Invalid world: ${String(world)}`;
    if (!isWorld(world)) throw new TypeError(message);
}