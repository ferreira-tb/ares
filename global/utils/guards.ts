import { farmUnits } from '$global/utils/constants.js';
import type { FarmUnits } from '$types/game.js';

/**
 * Verifica se a string passada é um nome de unidade válido.
 * @param unit Nome da unidade.
 */
export const isFarmUnit = (unit: string): unit is FarmUnits => farmUnits.includes(unit as FarmUnits);