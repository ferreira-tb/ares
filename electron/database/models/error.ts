import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class ErrorLog extends Model<InferAttributes<ErrorLog>, InferCreationAttributes<ErrorLog>> implements ErrorLogType {
    declare public readonly id: CreationOptional<number>;
    declare public readonly name: string;
    declare public readonly message: string;
    declare public readonly stack: string | null;
    declare public readonly world: World | null;
    declare public readonly url: string;
    declare public readonly time: number;
    declare public readonly ares: string;
    declare public readonly electron: string;
    declare public readonly chrome: string;
    declare public readonly tribal: string | null;
    declare public readonly locale: string | null;
    declare public readonly pending: CreationOptional<boolean>;
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
}, { sequelize, tableName: 'error_log', timestamps: false });

type EELAttributes = InferAttributes<ElectronErrorLog>;
type EELCreationAttributes = InferCreationAttributes<ElectronErrorLog>;
export class ElectronErrorLog extends Model<EELAttributes, EELCreationAttributes> implements ElectronErrorLogType {
    declare public readonly id: CreationOptional<number>;
    declare public readonly name: string;
    declare public readonly message: string;
    declare public readonly stack: string | null;
    declare public readonly time: number;
    declare public readonly ares: string;
    declare public readonly electron: string;
    declare public readonly chrome: string;
    declare public readonly tribal: string | null;
    declare public readonly locale: string | null;
    declare public readonly pending: CreationOptional<boolean>;
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
        allowNull: false
    },
    stack: {
        type: DataTypes.STRING,
        allowNull: true
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