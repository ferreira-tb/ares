import type { Schema as StoreSchema } from 'electron-store';
import type { TribalWarsGameData } from '$deimos/models/data.js';
import type { PlunderInfo } from '$deimos/models/plunder.js';

export type Schema = StoreSchema<Record<string, unknown>>;
export type JSONSchema = Schema[keyof Schema];

export interface BrowserStoreType extends TribalWarsGameData {
    /** Coordenadas da aldeia atual no formato de tupla. */
    currentCoords: [number | null, number | null];
    /** Quantidade total de recursos na aldeia atual. */
    currentVillageTotalResources: number | null;
};

export interface PlunderStoreType extends PlunderInfo { };