import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$database/database.js';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { PlunderConfigType, PlunderHistoryType, PlunderedAmount } from '$types/plunder.js';
import type { UserAlias } from '$types/electron.js';

export class PlunderConfig extends Model<InferAttributes<PlunderConfig>, InferCreationAttributes<PlunderConfig>> implements PlunderConfigType {
    declare readonly id: UserAlias;
    declare readonly active: boolean;
    declare readonly ignoreWall: boolean;
    declare readonly destroyWall: boolean;
    declare readonly groupAttack: boolean;
    declare readonly useC: boolean;
    declare readonly ignoreDelay: boolean;
    declare readonly blindAttack: boolean;
    declare readonly resourceRatio: number;
    declare readonly minutesUntilReload: number;
};

PlunderConfig.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    ignoreWall: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    destroyWall: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    groupAttack: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    useC: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    ignoreDelay: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    blindAttack: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    resourceRatio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.8
    },
    minutesUntilReload: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
    }
}, { sequelize, tableName: 'plunder_config', timestamps: true });

export class PlunderHistory extends Model<InferAttributes<PlunderHistory>, InferCreationAttributes<PlunderHistory>> implements PlunderHistoryType {
    declare readonly id: UserAlias;
    declare readonly last: PlunderedAmount;
    declare readonly total: PlunderedAmount;
};

PlunderHistory.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    last: {
        type: DataTypes.JSON,
        allowNull: false
    },
    total: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, { sequelize, tableName: 'plunder_history', timestamps: true });