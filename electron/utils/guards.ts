import { isString, AssertionError } from '@tb-dev/ts-guard';
import type { UserAlias } from '$types/electron.js';

export function isUserAlias(alias: unknown): alias is UserAlias {
    if (!isString(alias)) return false;
    return /^[a-z]+\d+__USERID__/.test(alias);
};

export function assertUserAlias(alias: unknown): asserts alias is UserAlias {
    if (!isUserAlias(alias)) throw new AssertionError('O alias do usuário é inválido.');
};