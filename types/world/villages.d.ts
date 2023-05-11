interface WorldVillagesModel extends import('sequelize').Model {
    readonly id: number;
    readonly name: string;
    readonly x: number;
    readonly y: number;
    readonly player: number;
    readonly points: number;
    readonly type: number;
};

type WorldVillagesType = Omit<WorldVillagesModel, keyof import('sequelize').Model>;