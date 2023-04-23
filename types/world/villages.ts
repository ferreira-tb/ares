import type { Model } from 'sequelize';

export interface WorldVillagesModel extends Model {
    readonly id: number;
    readonly name: string;
    readonly x: number;
    readonly y: number;
    readonly player: number;
    readonly points: number;
    readonly type: number;
};

export type WorldVillagesType = Omit<WorldVillagesModel, keyof Model>;