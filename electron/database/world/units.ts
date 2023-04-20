import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { WorldUnitsType, UnitDetails } from '$types/world';
import type { World } from '$types/game';

export class WorldUnits extends Model<InferAttributes<WorldUnits>, InferCreationAttributes<WorldUnits>> implements WorldUnitsType {
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

WorldUnits.init({
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
}, { sequelize, tableName: 'world_units', timestamps: true });