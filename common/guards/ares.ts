import { isString } from '$common/guards/base';
import { aliasRegex, allowedOriginRegexList } from '$common/regex';
import type { AresError } from '$common/error';

export const isUserAlias = (alias: unknown): alias is UserAlias => (isString(alias) && aliasRegex.test(alias));
export function assertUserAlias<T extends typeof AresError>(alias: unknown, SomeError: T, message?: string): asserts alias is UserAlias {
    if (!isUserAlias(alias)) {
        if (!isString(message)) message = `Invalid user alias: ${String(alias)}`;
        throw new SomeError(message);
    };
};

export function isAllowedOrigin(url: string): boolean {
    const { origin } = new URL(url);
    return allowedOriginRegexList.some((regex) => regex.test(origin));
};