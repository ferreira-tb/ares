import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database/database';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { WorldConfigType, WorldUnitType, UnitDetails } from '$types/world';
import type { World } from '$types/game';

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

export class WorldUnit extends Model<InferAttributes<WorldUnit>, InferCreationAttributes<WorldUnit>> implements WorldUnitType {
    declare readonly id: World;
    declare readonly archer: UnitDetails | null;
    declare readonly spear: UnitDetails;
    declare readonly sword: UnitDetails;
    declare readonly axe: UnitDetails;
    declare readonly spy: UnitDetails;
    declare readonly light: UnitDetails;
    declare readonly heavy: UnitDetails;
    declare readonly knight: UnitDetails;
    declare readonly marcher: UnitDetails | null;
    declare readonly ram: UnitDetails;
    declare readonly catapult: UnitDetails;
    declare readonly snob: UnitDetails;
    declare readonly militia: UnitDetails;
};

WorldUnit.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    archer: {
        type: DataTypes.JSON,
        allowNull: true
    },
    spear: {
        type: DataTypes.JSON,
        allowNull: false
    },
    sword: {
        type: DataTypes.JSON,
        allowNull: false
    },
    axe: {
        type: DataTypes.JSON,
        allowNull: false
    },
    spy: {
        type: DataTypes.JSON,
        allowNull: false
    },
    light: {
        type: DataTypes.JSON,
        allowNull: false
    },
    heavy: {
        type: DataTypes.JSON,
        allowNull: false
    },
    knight: {
        type: DataTypes.JSON,
        allowNull: false
    },
    marcher: {
        type: DataTypes.JSON,
        allowNull: true
    },
    ram: {
        type: DataTypes.JSON,
        allowNull: false
    },
    catapult: {
        type: DataTypes.JSON,
        allowNull: false
    },
    snob: {
        type: DataTypes.JSON,
        allowNull: false
    },
    militia: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, { sequelize, tableName: 'world_unit', timestamps: true });
