import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias, assertWallLevel } from '$global/guards';
import { DatabaseError } from '$electron/error';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

export class PlunderConfig extends Model<InferAttributes<PlunderConfig>, InferCreationAttributes<PlunderConfig>> implements PlunderConfigType {
    declare readonly id: UserAlias;

    // Painel
    declare readonly active: boolean;
    declare readonly ignoreWall: boolean;
    declare readonly destroyWall: boolean;
    declare readonly groupAttack: boolean;
    declare readonly useC: boolean;
    declare readonly ignoreDelay: boolean;
    declare readonly blindAttack: boolean;

    // Ataque
    declare readonly maxDistance: number;
    declare readonly ignoreOlderThan: number;
    declare readonly attackDelay: number;
    declare readonly resourceRatio: number;
    declare readonly blindAttackPattern: BlindAttackPattern;

    // Modelo C
    declare readonly useCPattern: UseCPattern;
    declare readonly maxDistanceC: number;
    declare readonly ignoreOlderThanC: number;
    declare readonly useCWhenResourceRatioIsBiggerThan: number;

    // Grupo
    declare readonly plunderGroupId: number | null;
    declare readonly fieldsPerWave: number;
    declare readonly villageDelay: number;

    // Muralha
    declare readonly wallLevelToIgnore: WallLevel;
    declare readonly wallLevelToDestroy: WallLevel;
    declare readonly destroyWallMaxDistance: number;
    
    // Outros
    declare readonly minutesUntilReload: number;
    declare readonly plunderedResourcesRatio: number;
    declare readonly pageDelay: number;
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