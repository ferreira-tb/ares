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
    readonly allies: ReadonlyArray<WorldAllyType>;
    readonly players: ReadonlyArray<WorldPlayerType>;
    readonly villages: ReadonlyArray<WorldVillageType>;
};

type WorldDataFetchHistoryType = {
    readonly world: World;
    readonly village: number;
    readonly player: number;
    readonly ally: number;
};

type PartialWorldDataFetchHistory = Partial<{
    -readonly [key in keyof Omit<WorldDataFetchHistoryType, 'world'>]: number;
}>;

/** Indica quais dados devem ser requisitados. */
type WorldDataRequest = {
    [key in keyof WorldDataFetchHistoryType]: key extends 'world' ? World : boolean;
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

interface WorldAlliesModel extends SequelizeModel {
    id: number;
    name: string;
    tag: string;
    members: number;
    villages: number;
    points: number;
    allPoints: number;
    rank: number;
};

type WorldAllyType = Omit<WorldAlliesModel, keyof import('sequelize').Model>;

interface WorldPlayersModel extends SequelizeModel {
    id: number;
    name: string;
    ally: number;
    villages: number;
    points: number;
    rank: number;
};

type WorldPlayerType = Omit<WorldPlayersModel, keyof import('sequelize').Model>;

interface WorldVillagesModel extends SequelizeModel {
    id: number;
    name: string;
    x: number;
    y: number;
    player: number;
    points: number;
    type: number;
};

type WorldVillageType = Omit<WorldVillagesModel, keyof import('sequelize').Model>;