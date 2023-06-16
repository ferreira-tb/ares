import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias, assertWallLevel } from '$common/guards';
import { DatabaseError } from '$electron/error';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

export class PlunderConfig extends Model<InferAttributes<PlunderConfig>, InferCreationAttributes<PlunderConfig>> implements PlunderConfigType {
    declare public readonly id: UserAlias;

    // Painel
    declare public readonly active: boolean;
    declare public readonly ignoreWall: boolean;
    declare public readonly destroyWall: boolean;
    declare public readonly groupAttack: boolean;
    declare public readonly useC: boolean;
    declare public readonly ignoreDelay: boolean;
    declare public readonly blindAttack: boolean;

    // Ataque
    declare public readonly maxDistance: number;
    declare public readonly ignoreOlderThan: number;
    declare public readonly attackDelay: number;
    declare public readonly resourceRatio: number;
    declare public readonly blindAttackPattern: BlindAttackPattern;

    // Modelo C
    declare public readonly useCPattern: UseCPattern;
    declare public readonly maxDistanceC: number;
    declare public readonly ignoreOlderThanC: number;
    declare public readonly useCWhenResourceRatioIsBiggerThan: number;

    // Grupo
    declare public readonly plunderGroupId: number | null;
    declare public readonly fieldsPerWave: number;
    declare public readonly villageDelay: number;

    // Muralha
    declare public readonly wallLevelToIgnore: WallLevel;
    declare public readonly wallLevelToDestroy: WallLevel;
    declare public readonly destroyWallMaxDistance: number;
    
    // Outros
    declare public readonly minutesUntilReload: number;
    declare public readonly plunderedResourcesRatio: number;
    declare public readonly pageDelay: number;
};

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

    // Painel
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
    attackDelay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 200,
        validate: {
            min: 100,
            max: 60000,
            isInt: true
        }
    },
    resourceRatio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.8,
        validate: {
            min: 0.2,
            max: 1,
            isFloat: true
        }
    },
    blindAttackPattern: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'smaller' satisfies BlindAttackPattern,
        validate: {
            isIn: [['smaller', 'bigger'] satisfies BlindAttackPattern[]]
        }
    },

    // Modelo C
    useCPattern: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'normal' satisfies UseCPattern,
        validate: {
            isIn: [['excess', 'normal', 'only'] satisfies UseCPattern[]]
        }
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
    useCWhenResourceRatioIsBiggerThan: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 3,
        validate: {
            min: 1,
            isFloat: true
        }
    },

    // Grupo
    plunderGroupId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
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
    wallLevelToIgnore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            isWallLevel(value: unknown) {
                assertWallLevel(value, DatabaseError);
            }
        }
    },
    
    wallLevelToDestroy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            isWallLevel(value: unknown) {
                assertWallLevel(value, DatabaseError);
            }
        }
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
    plunderedResourcesRatio: {
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
    }  
}, { sequelize, tableName: 'plunder_config', timestamps: true });