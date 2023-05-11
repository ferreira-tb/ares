type WorldConfigType = {
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

type WorldDataType = {
    villages: WorldVillagesType[];
};

type WorldDataFetchHistoryType = {
    readonly world: World;
    readonly village: number | null;
    readonly player: number | null;
    readonly ally: number | null;
};

type UnitDetails = {
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

type WorldUnitsType = {
    [key in AllUnits]: key extends 'archer' | 'marcher' ? UnitDetails | null : UnitDetails
};

interface WorldVillagesModel extends SequelizeModel {
    readonly id: number;
    readonly name: string;
    readonly x: number;
    readonly y: number;
    readonly player: number;
    readonly points: number;
    readonly type: number;
};

type WorldVillagesType = Omit<WorldVillagesModel, keyof import('sequelize').Model>;