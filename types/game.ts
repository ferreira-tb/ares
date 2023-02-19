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