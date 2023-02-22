import type { Ref, ComputedRef } from 'vue';

export type WorldLocale = 'br';
export type World =
    | `${WorldLocale}${string}` // Mundo padrão.
    | `${WorldLocale}s${string}` // Rodada speed.
    | `${WorldLocale}p${string}`; // Mundo casual.

export type Resources = 'wood' | 'stone' | 'iron';
export type ResourcesPTBR = 'Madeira' | 'Argila' | 'Ferro';
export type ResourceAmount = { [key in Resources]: number };

/** Unidades que podem ser usadas no assistente de saque. */
export type FarmUnits =
    | 'spear'
    | 'sword'
    | 'axe'
    | 'spy'
    | 'light'
    | 'heavy'
    | 'knight'
    | 'archer'
    | 'marcher';

/** Unidades que não podem saquear. */
export type OtherUnits =
    | 'ram'
    | 'catapult'
    | 'snob'
    | 'militia';

/** Todas as unidades do jogo. */
export type AllUnits =
    | FarmUnits
    | OtherUnits;

export type FarmUnitsAmount = { [key in FarmUnits]: number };
export type UnitAmount = { [key in AllUnits]: number };
export type UnitsAmountAsStrings = { [key in AllUnits]: string };

export type PiniaUnitStoreKeys = keyof UnitAmount | 'raw';
export type PiniaUnitStoreValues = Ref<UnitAmount[keyof UnitAmount]>;
export type PiniaUnitStoreActions = () => UnitAmount;
export type PiniaUnitStore = Record<PiniaUnitStoreKeys, PiniaUnitStoreValues | PiniaUnitStoreActions>;

export type GameScreen =
    | 'am_farm'
    | 'info_player'
    | 'market'
    | 'overview'
    | 'overview_villages'
    | 'place'
    | 'report';

export type Coords = {
    x: number;
    y: number;
};

export interface TribalWarsGameDataType {
    /** Local. */
    readonly locale: string | null;
    /** Mundo atual. */
    readonly world: World | null;
    /** Versão do Tribal Wars. */
    readonly majorVersion: string | null;
    /** Nome do jogador ativo. */
    readonly player: string | null;
    /** ID do jogador ativo. */
    readonly playerId: number | null;
    /** Pontuação do jogador. */
    readonly playerPoints: number | null;
    /** Quantidade de aldeias que o jogador possui. */
    readonly villageAmount: number | null;
    /** Grupo de aldeias atual. */
    readonly groupId: number | null;

    /** Conta premium. */
    readonly premium: boolean | null;
    /** Gerente de conta. */
    readonly accountManager: boolean | null;
    /** Assistente de saque. */
    readonly farmAssistant: boolean | null;

    /** Janela atual. */
    readonly screen: string | null;
    /** Modo da janela atual. */
    readonly screenMode: string | null;
    /** Indica se está no modo de pré-jogo. */
    readonly pregame: boolean | null;

    /** Coordenada X da aldeia atual. */
    readonly currentX: number | null;
    /** Coordenada Y da aldeia atual. */
    readonly currentY: number | null;
    /** ID da aldeia atual. */
    readonly currentVillageId: number | null;
    /** Nome da aldeia atual. */
    readonly currentVillageName: string | null;
    /** População da aldeia atual. */
    readonly currentVillagePopulation: number | null;
    /** População máxima da aldeia atual. */
    readonly currentVillageMaxPopulation: number | null;
    /** Pontos da aldeia atual. */
    readonly currentVillagePoints: number | null;
    /** Quantidade de madeira na aldeia atual. */
    readonly currentVillageWood: number | null;
    /** Quantidade de argila na aldeia atual. */
    readonly currentVillageStone: number | null;
    /** Quantidade de ferro na aldeia atual. */
    readonly currentVillageIron: number | null;
    /** Capacidade de armazenamento máximo da aldeia atual. */
    readonly currentVillageMaxStorage: number | null;
};

export type PiniaAresStoreKeys = keyof TribalWarsGameDataType | 'currentCoords' | 'currentVillageTotalResources';
export type PiniaAresStoreValues = Ref<TribalWarsGameDataType[keyof TribalWarsGameDataType]>;
export type PiniaAresStoreGetters = ComputedRef<(number | null)[]> | ComputedRef<number | null>;
export type PiniaAresStore = Record<PiniaAresStoreKeys, PiniaAresStoreValues | PiniaAresStoreGetters>;