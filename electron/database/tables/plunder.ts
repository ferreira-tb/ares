import { DataTypes, Model } from 'sequelize';
import { isObject } from '@tb-dev/ts-guard';
import { sequelize } from '$database/database.js';
import { isUserAlias } from '$electron/utils/guards';
import { DatabaseError } from '$electron/error.js';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { PlunderConfigType, PlunderHistoryType, PlunderAttackDetails, BlindAttackPattern, UseCPattern } from '$types/plunder.js';
import type { UserAlias } from '$types/electron.js';
import type { CacheProxy } from '$stores/cache.js';

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

    // Configurações
    declare readonly wallLevelToIgnore: number;
    declare readonly wallLevelToDestroy: number;
    declare readonly destroyWallMaxDistance: number;
    declare readonly attackDelay: number;
    declare readonly resourceRatio: number;
    declare readonly minutesUntilReload: number;
    declare readonly maxDistance: number;
    declare readonly ignoreOlderThan: number;

    declare readonly blindAttackPattern: BlindAttackPattern;
    declare readonly useCPattern: UseCPattern;
};

PlunderConfig.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },

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

    wallLevelToIgnore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    
    wallLevelToDestroy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    destroyWallMaxDistance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 20
    },
    attackDelay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 200
    },
    resourceRatio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.8
    },
    minutesUntilReload: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
    },
    maxDistance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 20
    },
    ignoreOlderThan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
    },

    blindAttackPattern: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'smaller' satisfies BlindAttackPattern
    },
    useCPattern: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'normal' satisfies UseCPattern
    }
}, { sequelize, tableName: 'plunder_config', timestamps: true });

export class PlunderHistory extends Model<InferAttributes<PlunderHistory>, InferCreationAttributes<PlunderHistory>> implements PlunderHistoryType {
    declare readonly id: UserAlias;
    declare readonly last: PlunderAttackDetails;
    declare readonly total: PlunderAttackDetails;

    public static async getHistoryAsJSON(cacheProxy: CacheProxy): Promise<PlunderHistory | null> {
        try {
            const result = await sequelize.transaction(async (transaction) => {
                const userAlias = cacheProxy.userAlias;
                if (!isUserAlias(userAlias)) return null;
    
                const plunderHistory = await PlunderHistory.findByPk(userAlias, { transaction });
                if (!isObject(plunderHistory)) return null;
    
                return plunderHistory.toJSON();
            });
    
            return result as PlunderHistory | null;
    
        } catch (err) {
            DatabaseError.catch(err);
            return null;
        };
    }
};

PlunderHistory.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    last: {
        type: DataTypes.JSON,
        allowNull: false
    },
    total: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, { sequelize, tableName: 'plunder_history', timestamps: true });