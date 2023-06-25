import { farmUnits, allUnits } from '$common/enum';
import { regionRegex, worldRegex } from '$common/regex';
import type { AresError } from '$common/error';

/** Verifica se o valor passado é um nome válido de unidade. */
export const isUnit = (unit: unknown): unit is AllUnits => allUnits.includes(unit as AllUnits);
export function assertUnit<T extends typeof AresError>(unit: unknown, SomeError: T, message?: string): asserts unit is AllUnits {
    if (typeof message !== 'string') message = 'Invalid unit name.';
    if (!isUnit(unit)) throw new SomeError(message);
}

/** Verifica se o valor passado é um nome válido de unidade usada para saque. */
export const isFarmUnit = (unit: unknown): unit is FarmUnits => farmUnits.includes(unit as FarmUnits);
export function assertFarmUnit<T extends typeof AresError>(unit: unknown, SomeError: T, message?: string): asserts unit is FarmUnits {
    if (typeof message !== 'string') message = 'Invalid farm unit name.';
    if (!isFarmUnit(unit)) throw new SomeError(message);
}

export const isGameRegion = (region: unknown): region is GameRegion => (typeof region === 'string' && regionRegex.test(region));
export function assertGameRegion<T extends typeof AresError>(region: unknown, SomeError: T, message?: string): asserts region is GameRegion {
    if (typeof message !== 'string') message = 'Invalid game region.';
    if (!isGameRegion(region)) throw new SomeError(message);
}

export const isWorld = (world: unknown): world is World => (typeof world === 'string' && worldRegex.test(world));
export function assertWorld<T extends typeof AresError>(world: unknown, SomeError: T, message?: string): asserts world is World {
    if (typeof message !== 'string') message = 'Invalid world.';
    if (!isWorld(world)) throw new SomeError(message);
}