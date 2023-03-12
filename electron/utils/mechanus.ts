import { isWorld, isWorldOrNull, isWallLevel } from '$electron/utils/guards.js';
import { ProxyStoreError } from '$electron/error.js';
import type { MechanusRefOptions } from 'mechanus';
import type { World, WallLevel } from '$types/game.js';

import {
    arrayIncludes,
    isStringOrNull,
    isIntegerOrNull,
    isBoolean,
    isBooleanOrNull,
    isString,
    isInteger,
    isPositiveInteger,
    isPositiveNumber,
    isObjectOrNull,
    isFiniteNumber
} from '@tb-dev/ts-guard';

export const arrayIncludesRef = <T>(array: T[]): MechanusRefOptions<T> => ({
    validator: (value: unknown): value is T => arrayIncludes(array, value),
    throwOnInvalid: true,
    errorClass: ProxyStoreError
});

export const stringRef: MechanusRefOptions<string> = {
    validator: isString,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const stringOrNullRef: MechanusRefOptions<string | null> = {
    validator: isStringOrNull,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const worldRef: MechanusRefOptions<World> = {
    validator: isWorld,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const worldOrNullRef: MechanusRefOptions<World | null> = {
    validator: isWorldOrNull,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const integerRef: MechanusRefOptions<number> = {
    validator: isInteger,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const integerOrNullRef: MechanusRefOptions<number | null> = {
    validator: isIntegerOrNull,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const positiveIntegerRef: MechanusRefOptions<number> = {
    validator: isPositiveInteger,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const positiveNumberRef: MechanusRefOptions<number> = {
    validator: isPositiveNumber,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const finiteNumberRef: MechanusRefOptions<number> = {
    validator: isFiniteNumber,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const wallLevelRef: MechanusRefOptions<WallLevel> = {
    validator: isWallLevel,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const booleanRef: MechanusRefOptions<boolean> = {
    validator: isBoolean,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const booleanOrNullRef: MechanusRefOptions<boolean | null> = {
    validator: isBooleanOrNull,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
};

export const objectOrNullRef = <T extends object>() => ({
    validator: isObjectOrNull,
    throwOnInvalid: true,
    errorClass: ProxyStoreError
} as MechanusRefOptions<T | null>);