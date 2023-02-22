import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database/database.js';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { ErrorLogType, DOMErrorLogType, MainProcessErrorLogType } from '$types/error.js';
import type { World } from '$types/game.js';

export class ErrorLog extends Model<InferAttributes<ErrorLog>, InferCreationAttributes<ErrorLog>> implements ErrorLogType {
    declare readonly id: CreationOptional<number>;
    declare readonly name: string;
    declare readonly message: string;
    declare readonly stack: string | null;
    declare readonly world: World | null;
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
        allowNull: false,
    },
    stack: {
        type: DataTypes.STRING,
        allowNull: true,
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

export class DOMErrorLog extends Model<InferAttributes<DOMErrorLog>, InferCreationAttributes<DOMErrorLog>> implements DOMErrorLogType {
    declare readonly id: CreationOptional<number>;
    declare readonly name: string;
    declare readonly selector: string;
    declare readonly stack: string | null;
    declare readonly url: string;
    declare readonly world: World | null;
    declare readonly time: number;
    declare readonly ares: string;
    declare readonly electron: string;
    declare readonly chrome: string;
    declare readonly tribal: string | null;
    declare readonly locale: string | null;
    declare readonly pending: CreationOptional<boolean>;
};

DOMErrorLog.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    selector: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stack: {
        type: DataTypes.STRING,
        allowNull: true,
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
}, { sequelize, tableName: 'dom_error_log', timestamps: false });

type MPAttributes = InferAttributes<MainProcessErrorLog>;
type MPCreationAttributes = InferCreationAttributes<MainProcessErrorLog>;

export class MainProcessErrorLog extends Model<MPAttributes, MPCreationAttributes> implements MainProcessErrorLogType {
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

MainProcessErrorLog.init({
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
}, { sequelize, tableName: 'main_process_error_log', timestamps: false });