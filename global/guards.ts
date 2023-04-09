import { isString, isInteger, isPositiveNumber } from '@tb-dev/ts-guard';
import { farmUnits, allUnits } from '$global/constants';
import { worldRegex, aliasRegex, allowedOriginRegexList } from '$global/regex';
import type { AresError } from '$global/error';
import type { FarmUnits, World, WallLevel, AllUnits } from '$types/game';
import type { UserAlias } from '$types/electron';

/** Verifica se o valor passado é um nome válido de unidade. */
export const isUnit = (unit: unknown): unit is AllUnits => allUnits.includes(unit as AllUnits);

export function assertUnit(unit: unknown, SomeError: typeof AresError, message?: string): asserts unit is AllUnits {
    if (!isString(message)) message = 'Invalid unit name.';
    if (!isUnit(unit)) throw new SomeError(message);
};

/** Verifica se o valor passado é um nome válido de unidade usada para saque. */
export const isFarmUnit = (unit: unknown): unit is FarmUnits => farmUnits.includes(unit as FarmUnits);

export function assertFarmUnit<T extends typeof AresError>(unit: unknown, SomeError: T, message?: string): asserts unit is FarmUnits {
    if (!isString(message)) message = 'Invalid farm unit name.';
    if (!isFarmUnit(unit)) throw new SomeError(message);
};

export function isUserAlias(alias: unknown): alias is UserAlias {
    if (!isString(alias)) return false;
    return aliasRegex.test(alias);
};

export function assertUserAlias<T extends typeof AresError>(alias: unknown, SomeError: T, message?: string): asserts alias is UserAlias {
    if (!isString(message)) message = 'Invalid user alias.';
    if (!isUserAlias(alias)) throw new SomeError(message);
};

export const isWorld = (world: unknown): world is World => {
    if (!isString(world)) return false;
    return worldRegex.test(world);
};

export function assertWorld<T extends typeof AresError>(world: unknown, SomeError: T, message?: string): asserts world is World {
    if (!isString(message)) message = 'Invalid world.';
    if (!isWorld(world)) throw new SomeError(message);
};

export const isWorldOrNull = (world: unknown): world is World | null => {
    if (world === null) return true;
    return isWorld(world);
};

export function assertWorldOrNull<T extends typeof AresError>(world: unknown, SomeError: T, message?: string): asserts world is World | null {
    if (!isString(message)) message = 'Invalid world.';
    if (!isWorldOrNull(world)) throw new SomeError(message);
};

export const isWallLevel = (level: unknown): level is WallLevel => {
    if (!isInteger(level)) return false;
    return level >= 0 && level <= 20;
};

export function assertWallLevel<T extends typeof AresError>(level: unknown, SomeError: T, message?: string): asserts level is WallLevel {
    if (!isString(message)) message = 'Invalid wall level.';
    if (!isWallLevel(level)) throw new SomeError(message);
};

export const isDistance = (distance: unknown): distance is number => {
    if (!isPositiveNumber(distance)) return false;
    return distance >= 1;
};

export function assertDistance<T extends typeof AresError>(distance: unknown, SomeError: T, message?: string): asserts distance is number {
    if (!isString(message)) message = 'Invalid distance.';
    if (!isDistance(distance)) throw new SomeError(message);
};

export function isAllowedOrigin(url: string): boolean {
    const { origin } = new URL(url);
    return allowedOriginRegexList.some((regex) => regex.test(origin));
};