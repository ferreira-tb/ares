import type { World } from '$types/game.js';
import type { TribalWarsGameDataType, PlunderInfoType } from '$types/deimos.js';

export type UserAlias = `${string}__USERID__${string}`;
export type ModuleNames = 'error-log';

export interface BrowserStoreType extends TribalWarsGameDataType {
    /** Coordenadas da aldeia atual no formato de tupla. */
    currentCoords: [number | null, number | null];
    /** Quantidade total de recursos na aldeia atual. */
    currentVillageTotalResources: number | null;
};

export interface CacheStoreType {
    world: World | null;
    player: string | null;
    userAlias: UserAlias | null;
};

export interface PlunderStoreType extends PlunderInfoType { };