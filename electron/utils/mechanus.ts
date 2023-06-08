import { MechanusStoreError } from '$electron/error';
import { isFiniteNumber, isInteger, isString, isGameRegion, isWorld, isWallLevel } from '$common/guards';

export const arrayIncludesRef = <T>(array: T[]): MechanusRefOptions<T> => ({
    validator: (value: unknown): value is T => array.includes(value as T),
    throwOnInvalid: true,
    errorClass: MechanusStoreError
});

export const stringRef: MechanusRefOptions<string> = {
    validator: isString,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const stringOrNullRef: MechanusRefOptions<string | null> = {
    validator: (value: unknown): value is string | null => isString(value) || value === null,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const gameRegionRef: MechanusRefOptions<GameRegion> = {
    validator: isGameRegion,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const worldRef: MechanusRefOptions<World> = {
    validator: isWorld,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const worldOrNullRef: MechanusRefOptions<World | null> = {
    validator: (value: unknown): value is World | null => isWorld(value) || value === null,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const integerRef: MechanusRefOptions<number> = {
    validator: isInteger,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const integerOrNullRef: MechanusRefOptions<number | null> = {
    validator: (value: unknown): value is number | null => isInteger(value) || value === null,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const positiveIntegerRef: MechanusRefOptions<number> = {
    validator: (value: unknown): value is number => isInteger(value) && Math.sign(value) === 1,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const positiveIntegerOrNullRef: MechanusRefOptions<number | null> = {
    validator: (value: unknown): value is number | null => (isInteger(value) && Math.sign(value) === 1) || value === null,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const finiteNumberRef: MechanusRefOptions<number> = {
    validator: isFiniteNumber,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const positiveNumberRef: MechanusRefOptions<number> = {
    validator: (value: unknown): value is number => isFiniteNumber(value) && Math.sign(value) === 1,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const wallLevelRef: MechanusRefOptions<WallLevel> = {
    validator: isWallLevel,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const booleanRef: MechanusRefOptions<boolean> = {
    validator: (value: unknown): value is boolean => typeof value === 'boolean',
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};

export const booleanOrNullRef: MechanusRefOptions<boolean | null> = {
    validator: (value: unknown): value is boolean | null => typeof value === 'boolean' || value === null,
    throwOnInvalid: true,
    errorClass: MechanusStoreError
};