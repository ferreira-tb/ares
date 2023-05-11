import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

export class WorldConfig extends Model<InferAttributes<WorldConfig>, InferCreationAttributes<WorldConfig>> implements WorldConfigType {
    declare readonly id: World;
    declare readonly speed: number;
    declare readonly unitSpeed: number;
    declare readonly tradeCancelTime: number;
    declare readonly commandCancelTime: number;
    declare readonly archer: boolean;
    declare readonly church: boolean;
    declare readonly watchtower: boolean;
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