export type Resources = 'wood' | 'stone' | 'iron';

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