import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$common/guards';
import { DatabaseError } from '$electron/error';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export class PlunderConfig extends Model<
    InferAttributes<PlunderConfig>,
    InferCreationAttributes<PlunderConfig>
> implements PlunderConfigType {
    declare public readonly id: UserAlias;

    declare public readonly active: boolean;
    declare public readonly mode: 'single' | 'group';
    declare public readonly village: number | null;
    declare public readonly group: number;

    // Ataque
    declare public readonly maxDistance: number;
    declare public readonly ignoreOlderThan: number;
    declare public readonly ratio: number;
    declare public readonly attackDelay: number;
    declare public readonly blindAttack: PlunderConfigType['blindAttack'];

    // Grupo
    declare public readonly fieldsPerWave: number;
    declare public readonly villageDelay: number;

    // Muralha
    declare public readonly ignoreWall: boolean;
    declare public readonly wallLevelToIgnore: number;
    declare public readonly destroyWall: boolean;
    declare public readonly wallLevelToDestroy: number;
    declare public readonly destroyWallMaxDistance: number;
    declare public readonly demolitionTemplate: number;

    // Modelo C
    declare public readonly useC: PlunderConfigType['useC'];
    declare public readonly maxDistanceC: number;
    declare public readonly ignoreOlderThanC: number;
    declare public readonly useCWhenRatioIsBiggerThan: number;
    
    // Outros
    declare public readonly minutesUntilReload: number;
    declare public readonly estimate: number;
    declare public readonly pageDelay: number;

    declare public readonly createdAt: CreationOptional<Date>;
    declare public readonly updatedAt: CreationOptional<Date>;
}

PlunderConfig.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            isUserAlias(value: unknown) {
                assertUserAlias(value, DatabaseError);
            }
        }
    },

    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    mode: {
        type: DataTypes.ENUM('single', 'group'),
        allowNull: false,
        defaultValue: 'single'
    },
    village: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    group: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },

    // Ataque
    maxDistance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 20,
        validate: {
            min: 1,
            isFloat: true
        }
    },
    ignoreOlderThan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: {
            isInt: true
        }
    },
    ratio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.8,
        validate: {
            min: 0.2,
            max: 1,
            isFloat: true
        }
    },
    attackDelay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 200,
        validate: {
            min: 0,
            max: 60000,
            isInt: true
        }
    },
    blindAttack: {
        type: DataTypes.ENUM('smaller', 'bigger', 'never'),
        allowNull: false,
        defaultValue: 'never'
    },

    // Grupo
    fieldsPerWave: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 10,
        validate: {
            min: 5,
            isFloat: true
        }
    },
    villageDelay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2000,
        validate: {
            min: 100,
            max: 60000,
            isInt: true
        }
    },

    // Muralha
    ignoreWall: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    wallLevelToIgnore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    destroyWall: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    wallLevelToDestroy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    destroyWallMaxDistance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 20,
        validate: {
            min: 1,
            isFloat: true
        }
    },
    demolitionTemplate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: -1
    },

    // Modelo C
    useC: {
        type: DataTypes.ENUM('excess', 'normal', 'only', 'never'),
        allowNull: false,
        defaultValue: 'never'
    },
    maxDistanceC: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 10,
        validate: {
            min: 1,
            isFloat: true
        }
    },
    ignoreOlderThanC: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        validate: {
            isInt: true
        }
    },
    useCWhenRatioIsBiggerThan: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 3,
        validate: {
            min: 1,
            isFloat: true
        }
    },

    // Outros
    minutesUntilReload: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: {
            min: 1,
            max: 60,
            isInt: true
        }
    },
    estimate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 0.2,
            max: 1,
            isFloat: true
        }
    },
    pageDelay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2000,
        validate: {
            min: 100,
            max: 60000,
            isInt: true
        }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, { sequelize, tableName: 'plunder_config', timestamps: true });