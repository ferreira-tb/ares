import type { Schema as StoreSchema } from 'electron-store';
import type { Village } from '$types/deimos.js';
import type { TribalWarsGameData } from '$deimos/models/data.js';

export type Schema = StoreSchema<Record<string, unknown>>;
export type JSONSchema = Schema[keyof Schema];

export type BrowserStoreVillageKeys = 'x' | 'y';
export type BrowserStoreVillageType = Pick<Village, BrowserStoreVillageKeys>;

export interface BrowserStoreType extends TribalWarsGameData {
    /** Coordenadas da aldeia atual no formato de tupla. */
    currentCoords: [number | null, number | null];
    /** Quantidade total de recursos na aldeia atual. */
    currentVillageTotalResources: number | null;
};