import type { AllUnits } from '$types/game';

export type WorldConfigType = {
    /** Velocidade do mundo (FLOAT). */
    speed: number;
    /** Velocidade das unidades (FLOAT). */
    unitSpeed: number;

    /** Tempo para cancelamento de trocas (em segundos). */
    tradeCancelTime: number;
    /** Tempo para cancelamento de ataques (em segundos). */
    commandCancelTime: number;

    /** Indica se o mundo possui arqueiros. */
    archer: boolean;
    /** Indica se o mundo possui igrejas. */
    church: boolean;
    /** Indica se o mundo possui torres de vigia. */
    watchtower: boolean;
};

export type UnitDetails = {
    buildTime: number;
    pop: number;
    /** Velocidade da unidade (FLOAT). */
    speed: number;
    attack: number;
    defense: number;
    defenseCavalry: number;
    defenseArcher: number;
    carry: number;
};

export type WorldUnitType = {
    [key in AllUnits]: key extends 'archer' | 'marcher' ? UnitDetails | null : UnitDetails
};