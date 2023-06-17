import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

export class WorldConfig extends Model<InferAttributes<WorldConfig>, InferCreationAttributes<WorldConfig>> implements WorldConfigType {
    declare public readonly id: World;
    declare public readonly speed: number;
    declare public readonly unitSpeed: number;
    declare public readonly tradeCancelTime: number;
    declare public readonly commandCancelTime: number;
    declare public readonly archer: boolean;
    declare public readonly church: boolean;
    declare public readonly watchtower: boolean;
};

WorldConfig.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    speed: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    unitSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    tradeCancelTime: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    commandCancelTime: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    archer: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    church: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    watchtower: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, { sequelize, tableName: 'world_config', timestamps: true });