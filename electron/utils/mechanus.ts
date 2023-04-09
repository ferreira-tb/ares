import { isWorld, isWorldOrNull, isWallLevel } from '$global/guards';
import { MechanusStoreError } from '$electron/error';
import type { MechanusRefOptions } from 'mechanus';
import type { World, WallLevel } from '$types/game';

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
    isFiniteNumber,
    isPositiveIntegerOrNull
} from '@tb-dev/ts-guard';

export const arrayIncludesRef = <T>(array: T[]): MechanusRefOptions<T> => ({
    validator: (value: unknown): value is T => arrayIncludes(array, value),
    throwOnInvalid: true,
    errorClass: MechanusStoreError
});

export const stringRef: MechanusRefOptions<string> = {
    validator: isString,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const stringOrNullRef: MechanusRefOptions<string | null> = {
    validator: isStringOrNull,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const worldRef: MechanusRefOptions<World> = {
    validator: isWorld,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const worldOrNullRef: MechanusRefOptions<World | null> = {
    validator: isWorldOrNull,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const integerRef: MechanusRefOptions<number> = {
    validator: isInteger,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const integerOrNullRef: MechanusRefOptions<number | null> = {
    validator: isIntegerOrNull,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const positiveIntegerRef: MechanusRefOptions<number> = {
    validator: isPositiveInteger,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const positiveIntegerOrNullRef: MechanusRefOptions<number | null> = {
    validator: isPositiveIntegerOrNull,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const positiveNumberRef: MechanusRefOptions<number> = {
    validator: isPositiveNumber,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const finiteNumberRef: MechanusRefOptions<number> = {
    validator: isFiniteNumber,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const wallLevelRef: MechanusRefOptions<WallLevel> = {
    validator: isWallLevel,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const booleanRef: MechanusRefOptions<boolean> = {
    validator: isBoolean,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const booleanOrNullRef: MechanusRefOptions<boolean | null> = {
    validator: isBooleanOrNull,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const objectOrNullRef = <T extends object>() => ({
    validator: isObjectOrNull,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
} as MechanusRefOptions<T | null>);