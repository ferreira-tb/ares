import { isString, isInteger } from '@tb-dev/ts-guard';
import { worldRegex, aliasRegex, allowedOriginRegexList } from '$electron/utils/constants';
import type { MainProcessError } from '$electron/error';
import type { UserAlias } from '$types/electron';
import type { World, WallLevel } from '$types/game';

export function isUserAlias(alias: unknown): alias is UserAlias {
    if (!isString(alias)) return false;
    return aliasRegex.test(alias);
};

export function assertUserAlias(alias: unknown, SomeError: typeof MainProcessError, message?: string): asserts alias is UserAlias {
    if (!isString(message)) message = 'Invalid user alias.';
    if (!isUserAlias(alias)) throw new SomeError(message);
};

export const isWorld = (world: unknown): world is World => {
    if (!isString(world)) return false;
    return worldRegex.test(world);
};

export function assertWorld(world: unknown, SomeError: typeof MainProcessError, message?: string): asserts world is World {
    if (!isString(message)) message = 'Invalid world.';
    if (!isWorld(world)) throw new SomeError(message);
};

export const isWorldOrNull = (world: unknown): world is World | null => {
    if (world === null) return true;
    return isWorld(world);
};

export function assertWorldOrNull(world: unknown, SomeError: typeof MainProcessError, message?: string): asserts world is World | null {
    if (!isString(message)) message = 'Invalid world.';
    if (!isWorldOrNull(world)) throw new SomeError(message);
};

export const isWallLevel = (level: unknown): level is WallLevel => {
    if (!isInteger(level)) return false;
    return level >= 0 && level <= 20;
};

export function assertWallLevel(level: unknown, SomeError: typeof MainProcessError, message?: string): asserts level is WallLevel {
    if (!isString(message)) message = 'Invalid wall level.';
    if (!isWallLevel(level)) throw new SomeError(message);
};

export function isAllowedURL(url: string): boolean {
    const { origin } = new URL(url);
    return allowedOriginRegexList.some((regex) => regex.test(origin));
};