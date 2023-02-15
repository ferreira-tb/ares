import type { Schema as StoreSchema } from 'electron-store';
import type { Village } from '$types/deimos.js';

export type Schema = StoreSchema<Record<string, unknown>>;
export type JSONSchema = Schema[keyof Schema];

export type BrowserStoreVillageKeys = 'x' | 'y';
export type BrowserStoreVillageType = Pick<Village, BrowserStoreVillageKeys>;

/** `null` indica que o usuário se encontra numa página a partir da qual não é possível obter essas informações. */
export type BrowserStoreType = {
    /** Versão do Tribal Wars. */
    majorVersion: string | null;
    /** Mundo atual. */
    world: string | null;
    /** Nome do jogador ativo. */
    player: string | null;
    /** ID do jogador ativo. */
    playerId: number | null;
    /** Pontuação do jogador. */
    playerPoints: number | null;
    /** Quantidade de aldeias que o jogador possui. */
    villageAmount: number | null;
    /** Grupo de aldeias atual. */
    groupId: number | null;

    // Features
    /** Conta premium. */
    premium: boolean | null;
    /** Gerente de conta. */
    accountManager: boolean | null;
    /**
     * Assistente de saque.
     * No jogo consta como FarmAssistent, mas no Deimos está como FarmAssistant
     */
    farmAssistant: boolean | null;

    /** Janela atual. */
    screen: string | null;
    /** Modo da janela atual. */
    screenMode: string | null;
    /** Indica se está no modo de pré-jogo. */
    pregame: boolean | null;

    /** Coordenada X da aldeia atual. */
    currentX: number | null;
    /** Coordenada Y da aldeia atual. */
    currentY: number | null;
    /** Coordenadas da aldeia atual no formato de tupla. */
    currentCoords: [number | null, number | null];
    /** ID da aldeia atual. */
    currentVillageId: number | null;
    /** Nome da aldeia atual. */
    currentVillageName: string | null;
    /** População da aldeia atual. */
    currentVillagePopulation: number | null;
    /** População máxima da aldeia atual. */
    currentVillageMaxPopulation: number | null;
    /** Pontos da aldeia atual. */
    currentVillagePoints: number | null;
    /** Quantidade de madeira na aldeia atual. */
    currentVillageWood: number | null;
    /** Quantidade de argila na aldeia atual. */
    currentVillageStone: number | null;
    /** Quantidade de ferro na aldeia atual. */
    currentVillageIron: number | null;
    /** Quantidade total de recursos na aldeia atual. */
    currentVillageTotalResources: number | null;
    /** Capacidade de armazenamento máximo da aldeia atual. */
    currentVillageMaxStorage: number | null;
};