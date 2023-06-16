import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

export class WorldUnits extends Model<InferAttributes<WorldUnits>, InferCreationAttributes<WorldUnits>> implements WorldUnitsType {
    declare public readonly id: World;
    declare public readonly archer: UnitDetails | null;
    declare public readonly spear: UnitDetails;
    declare public readonly sword: UnitDetails;
    declare public readonly axe: UnitDetails;
    declare public readonly spy: UnitDetails;
    declare public readonly light: UnitDetails;
    declare public readonly heavy: UnitDetails;
    declare public readonly knight: UnitDetails;
    declare public readonly marcher: UnitDetails | null;
    declare public readonly ram: UnitDetails;
    declare public readonly catapult: UnitDetails;
    declare public readonly snob: UnitDetails;
    declare public readonly militia: UnitDetails;
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