import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database/database.js';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { ErrorLogType, DOMErrorLogType } from '$types/error.js';

export class ErrorLog extends Model<InferAttributes<ErrorLog>, InferCreationAttributes<ErrorLog>> implements ErrorLogType {
    declare readonly id: CreationOptional<number>;
    declare readonly name: string;
    declare readonly message: string;
    declare readonly time: number;
    declare readonly ares: string;
    declare readonly electron: string;
    declare readonly chrome: string;
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
        allowNull: false,
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
    }
}, { sequelize, tableName: 'error_log', timestamps: false });

export class DOMErrorLog extends Model<InferAttributes<DOMErrorLog>, InferCreationAttributes<DOMErrorLog>> implements DOMErrorLogType {
    declare readonly id: CreationOptional<number>;
    declare readonly selector: string;
    declare readonly url: string;
    declare readonly world: string | null;
    declare readonly time: number;
    declare readonly ares: string;
    declare readonly electron: string;
    declare readonly chrome: string;
};

DOMErrorLog.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    selector: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    world: {
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
    }
}, { sequelize, tableName: 'dom_error_log', timestamps: false });