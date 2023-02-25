import type { IntRange, IntRangeToStrings } from '$types/utils.js';

//////// MUNDO
export type WorldLocale = 'br';
export type World =
    | `${WorldLocale}${string}` // Mundo padrão.
    | `${WorldLocale}s${string}` // Rodada speed.
    | `${WorldLocale}p${string}`; // Mundo casual.


//////// RECURSOS
export type Resources = 'wood' | 'stone' | 'iron';
export type ResourcesPTBR = 'Madeira' | 'Argila' | 'Ferro';
export type ResourceAmount = { [key in Resources]: number };

//////// UNIDADES
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
export type PlaceUnitsAmount = Partial<Omit<UnitAmount, 'militia'>>;

//////// CONSTRUÇÕES
export type WallLevel = IntRange<0, 21>;
export type StringWallLevel = IntRangeToStrings<0, 21>;

//////// OUTROS
export type DemolitionTroops = Omit<UnitAmount, 'snob' | 'militia' | 'knight'>;
export type UnitsToDestroyWall = Record<StringWallLevel, DemolitionTroops>;

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
    readonly ares: {
        /** Local. */
        readonly locale: string | null;
        /** Mundo atual. */
        readonly world: World | null;
        /** Versão do Tribal Wars. */
        readonly majorVersion: string | null;
        /** Janela atual. */
        readonly screen: string | null;
        /** Modo da janela atual. */
        readonly screenMode: string | null;
        /** Indica se está no modo de pré-jogo. */
        readonly pregame: boolean | null;
        /** Grupo de aldeias atual. */
        readonly groupId: number | null;
    };

    readonly features: {
        /** Conta premium. */
        readonly premium: boolean | null;
        /** Gerente de conta. */
        readonly accountManager: boolean | null;
        /** Assistente de saque. */
        readonly farmAssistant: boolean | null;
    };

    readonly player: {
        /** Nome do jogador ativo. */
        readonly name: string | null;
        /** ID do jogador ativo. */
        readonly id: number | null;
        /** Pontuação do jogador. */
        readonly points: number | null;
        /** Quantidade de aldeias que o jogador possui. */
        readonly villageAmount: number | null;
    };
    
    readonly currentVillage: {
        /** Coordenada X da aldeia atual. */
        readonly x: number | null;
        /** Coordenada Y da aldeia atual. */
        readonly y: number | null;
        /** ID da aldeia atual. */
        readonly id: number | null;
        /** Nome da aldeia atual. */
        readonly name: string | null;
        /** População da aldeia atual. */
        readonly population: number | null;
        /** População máxima da aldeia atual. */
        readonly maxPopulation: number | null;
        /** Pontos da aldeia atual. */
        readonly points: number | null;
        /** Quantidade de madeira na aldeia atual. */
        readonly wood: number | null;
        /** Quantidade de argila na aldeia atual. */
        readonly stone: number | null;
        /** Quantidade de ferro na aldeia atual. */
        readonly iron: number | null;
        /** Capacidade de armazenamento máximo da aldeia atual. */
        readonly maxStorage: number | null;
    };
};