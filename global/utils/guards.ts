import { isString, isInteger } from '@tb-dev/ts-guard';
import { farmUnits, worldRegex, aliasRegex } from '$global/utils/constants.js';
import type { AresError } from '$global/error.js';
import type { FarmUnits, World, WallLevel } from '$types/game.js';
import type { UserAlias } from '$types/electron.js';

/**
 * Verifica se a string passada é um nome válido de unidade usada para saque.
 * @param unit Nome da unidade.
 */
export const isFarmUnit = (unit: string): unit is FarmUnits => farmUnits.includes(unit as FarmUnits);

export function assertFarmUnit(unit: string, err: typeof AresError, message?: string): asserts unit is FarmUnits {
    if (!isString(message)) message = 'O nome da unidade é inválido.';
    if (!isFarmUnit(unit)) throw new err(message);
};

export function isUserAlias(alias: unknown): alias is UserAlias {
    if (!isString(alias)) return false;
    return aliasRegex.test(alias);
};

export function assertUserAlias(alias: unknown, err: typeof AresError, message?: string): asserts alias is UserAlias {
    if (!isString(message)) message = 'O alias do usuário é inválido.';
    if (!isUserAlias(alias)) throw new err(message);
};

export const isWorld = (world: unknown): world is World => {
    if (!isString(world)) return false;
    return worldRegex.test(world);
};

export function assertWorld(world: unknown, err: typeof AresError, message?: string): asserts world is World {
    if (!isString(message)) message = 'O mundo é inválido.';
    if (!isWorld(world)) throw new err(message);
};

export const isWallLevel = (level: unknown): level is WallLevel => {
    if (!isInteger(level)) return false;
    return level >= 0 && level <= 20;
};

export function assertWallLevel(level: unknown, err: typeof AresError, message?: string): asserts level is WallLevel {
    if (!isString(message)) message = 'O nível da muralha é inválido.';
    if (!isWallLevel(level)) throw new err(message);
};