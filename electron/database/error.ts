import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { ErrorLogType, ElectronProcessErrorLogType } from '$types/error';
import type { World } from '$types/game';

export class ErrorLog extends Model<InferAttributes<ErrorLog>, InferCreationAttributes<ErrorLog>> implements ErrorLogType {
    declare readonly id: CreationOptional<number>;
    declare readonly name: string;
    declare readonly message: string;
    declare readonly stack: string | null;
    declare readonly world: World | null;
    declare readonly url: string;
    declare readonly time: number;
    declare readonly ares: string;
    declare readonly electron: string;
    declare readonly chrome: string;
    declare readonly tribal: string | null;
    declare readonly locale: string | null;
    declare readonly pending: CreationOptional<boolean>;
};

ErrorLog.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stack: {
        type: DataTypes.STRING,
        allowNull: true
    },
    world: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        }
    },
    ares: {
        type: DataTypes.STRING,
        allowNull: false
    },
    electron: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chrome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tribal: {
        type: DataTypes.STRING,
        allowNull: true
    },
    locale: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pending: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, { sequelize, tableName: 'error_log', timestamps: false });

type EELAttributes = InferAttributes<ElectronErrorLog>;
type EELCreationAttributes = InferCreationAttributes<ElectronErrorLog>;
export class ElectronErrorLog extends Model<EELAttributes, EELCreationAttributes> implements ElectronProcessErrorLogType {
    declare readonly id: CreationOptional<number>;
    declare readonly name: string;
    declare readonly message: string;
    declare readonly stack: string | null;
    declare readonly time: number;
    declare readonly ares: string;
    declare readonly electron: string;
    declare readonly chrome: string;
    declare readonly tribal: string | null;
    declare readonly locale: string | null;
    declare readonly pending: CreationOptional<boolean>;
};

ElectronErrorLog.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stack: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ares: {
        type: DataTypes.STRING,
        allowNull: false
    },
    electron: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chrome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tribal: {
        type: DataTypes.STRING,
        allowNull: true
    },
    locale: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pending: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, { sequelize, tableName: 'electron_error_log', timestamps: false });