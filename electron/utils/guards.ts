import { isString, AssertionError, isPositiveInteger } from '@tb-dev/ts-guard';
import { MainProcessError } from '$electron/error.js';
import { worldRegex, aliasRegex } from '$electron/utils/constants.js';
import type { UserAlias } from '$types/electron.js';
import type { World } from '$types/game.js';

export function isUserAlias(alias: unknown): alias is UserAlias {
    if (!isString(alias)) return false;
    return aliasRegex.test(alias);
};

export function assertUserAlias(alias: unknown): asserts alias is UserAlias {
    if (!isUserAlias(alias)) throw new AssertionError('O alias do usuário é inválido.');
};

export const isWorld = (world: unknown): world is World => {
    if (!isString(world)) return false;
    return worldRegex.test(world);
};

export function assertWorld(world: unknown, err: typeof MainProcessError, message?: string): asserts world is World {
    if (!isString(message)) message = 'O mundo informado é inválido.';
    if (!isWorld(world)) throw new err(message);
};

export const isWallLevel = (level: unknown): level is number => {
    if (!isPositiveInteger(level)) return false;
    return level >= 1 && level <= 20;
};

export function assertWallLevel(level: unknown, err: typeof MainProcessError, message?: string): asserts level is number {
    if (!isString(message)) message = 'O nível de muralha informado é inválido.';
    if (!isWallLevel(level)) throw new err(message);
};