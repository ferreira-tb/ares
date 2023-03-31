import { isString, isInteger, isPositiveNumber } from '@tb-dev/ts-guard';
import { farmUnits, worldRegex, aliasRegex, allUnits } from '$global/utils/constants.js';
import type { AresError } from '$global/error.js';
import type { FarmUnits, World, WallLevel, AllUnits } from '$types/game.js';
import type { UserAlias } from '$types/electron.js';

/** Verifica se o valor passado é um nome válido de unidade. */
export const isUnit = (unit: unknown): unit is AllUnits => allUnits.includes(unit as AllUnits);

export function assertUnit(unit: unknown, err: typeof AresError, message?: string): asserts unit is AllUnits {
    if (!isString(message)) message = 'Invalid unit name.';
    if (!isUnit(unit)) throw new err(message);
};

/** Verifica se o valor passado é um nome válido de unidade usada para saque. */
export const isFarmUnit = (unit: unknown): unit is FarmUnits => farmUnits.includes(unit as FarmUnits);

export function assertFarmUnit(unit: unknown, err: typeof AresError, message?: string): asserts unit is FarmUnits {
    if (!isString(message)) message = 'Invalid farm unit name.';
    if (!isFarmUnit(unit)) throw new err(message);
};

export function isUserAlias(alias: unknown): alias is UserAlias {
    if (!isString(alias)) return false;
    return aliasRegex.test(alias);
};

export function assertUserAlias(alias: unknown, err: typeof AresError, message?: string): asserts alias is UserAlias {
    if (!isString(message)) message = 'Invalid user alias.';
    if (!isUserAlias(alias)) throw new err(message);
};

export const isWorld = (world: unknown): world is World => {
    if (!isString(world)) return false;
    return worldRegex.test(world);
};

export function assertWorld(world: unknown, err: typeof AresError, message?: string): asserts world is World {
    if (!isString(message)) message = 'Invalid world.';
    if (!isWorld(world)) throw new err(message);
};

export const isWallLevel = (level: unknown): level is WallLevel => {
    if (!isInteger(level)) return false;
    return level >= 0 && level <= 20;
};

export function assertWallLevel(level: unknown, err: typeof AresError, message?: string): asserts level is WallLevel {
    if (!isString(message)) message = 'Invalid wall level.';
    if (!isWallLevel(level)) throw new err(message);
};

export const isDistance = (distance: unknown): distance is number => {
    if (!isPositiveNumber(distance)) return false;
    return distance >= 1;
};

export function assertDistance(distance: unknown, err: typeof AresError, message?: string): asserts distance is number {
    if (!isString(message)) message = 'Invalid distance.';
    if (!isDistance(distance)) throw new err(message);
};