import { isString } from '$global/guards/base';
import { aliasRegex, allowedOriginRegexList } from '$global/regex';
import type { AresError } from '$global/error';
import type { UserAlias } from '$types/electron';

export const isUserAlias = (alias: unknown): alias is UserAlias => (isString(alias) && aliasRegex.test(alias));
export function assertUserAlias<T extends typeof AresError>(alias: unknown, SomeError: T, message?: string): asserts alias is UserAlias {
    if (!isString(message)) message = 'Invalid user alias.';
    if (!isUserAlias(alias)) throw new SomeError(message);
};

export function isAllowedOrigin(url: string): boolean {
    const { origin } = new URL(url);
    return allowedOriginRegexList.some((regex) => regex.test(origin));
};