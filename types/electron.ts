import type { Schema as StoreSchema } from 'electron-store';
import type { Village } from '$types/deimos.js';

export type Schema = StoreSchema<Record<string, unknown>>;
export type JSONSchema = Schema[keyof Schema];

export type BrowserStoreVillageKeys = 'x' | 'y';
export type BrowserStoreVillageType = Pick<Village, BrowserStoreVillageKeys>;

export type BrowserStoreType = {
    /** Versão do Tribal Wars. */
    version: string | null;
    /** Mundo atual. */
    world: string | null;
    /** Nome do jogador ativo. */
    player: string | null;
    /** ID do jogador ativo. */
    playerId: number | null;
    /** Grupo de aldeias atual. */
    groupId: string | null;
};