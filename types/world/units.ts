import type { AllUnits } from '$types/game';

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

export type WorldUnitsType = {
    [key in AllUnits]: key extends 'archer' | 'marcher' ? UnitDetails | null : UnitDetails
};