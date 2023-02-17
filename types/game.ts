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
export type UnitsAmount = { [key in AllUnits]: number };
export type UnitsAmountAsStrings = { [key in AllUnits]: string };

export type GameScreen =
    | 'am_farm'
    | 'info_player'
    | 'market'
    | 'overview'
    | 'overview_villages'
    | 'place'
    | 'report';

export type XMLTags =
    | 'speed'
    | 'unit_speed'
    | 'archer'
    | `${AllUnits} speed`
    | `${AllUnits} carry`;

export type UnitDetails = {
    speed: number;
    carry: number;
};

export type PlunderedAmount = {
    wood: number;
    stone: number;
    iron: number;
    total: number;
    attackAmount: number;
};

export type Coords = {
    x: number;
    y: number;
};