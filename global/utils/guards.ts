import { isString } from '@tb-dev/ts-guard';
import { farmUnits, worldRegex } from '$global/utils/constants.js';
import type { AresError } from '$global/error.js';
import type { FarmUnits, World } from '$types/game.js';

/**
 * Verifica se a string passada é um nome válido de unidade usada para saque.
 * @param unit Nome da unidade.
 */
export const isFarmUnit = (unit: string): unit is FarmUnits => farmUnits.includes(unit as FarmUnits);

export const isWorld = (world: unknown): world is World => {
    if (!isString(world)) return false;
    return worldRegex.test(world);
};

export function assertWorld(world: unknown, err: typeof AresError, message?: string): asserts world is World {
    if (!isString(message)) message = 'O mundo informado é inválido.';
    if (!isWorld(world)) throw new err(message);
};