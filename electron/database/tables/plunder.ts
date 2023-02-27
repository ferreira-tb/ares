import { DataTypes, Model } from 'sequelize';
import { isObject, assertInteger } from '@tb-dev/ts-guard';
import { sequelize } from '$database/database.js';
import { isUserAlias, assertUserAlias, assertWallLevel } from '$electron/utils/guards';
import { DatabaseError } from '$electron/error.js';
import { unitsToDestroyWall } from '$electron/utils/constants.js';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { UserAlias } from '$types/electron.js';
import type { CacheProxy } from '$stores/cache.js';
import type { WallLevel, UnitsToDestroyWall } from '$types/game.js';

import type {
    PlunderConfigType,
    PlunderHistoryType,
    PlunderAttackDetails,
    BlindAttackPattern,
    UseCPattern,
    CustomPlunderTemplateType,
    DemolitionTemplateType
} from '$types/plunder.js';

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
    declare readonly wallLevelToIgnore: WallLevel;
    declare readonly wallLevelToDestroy: WallLevel;
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

    public static async getHistoryAsJSON(cacheProxy: CacheProxy): Promise<PlunderHistoryType | null> {
        try {
            const userAlias = cacheProxy.userAlias;
            if (!isUserAlias(userAlias)) return null;

            const plunderHistory = await PlunderHistory.findByPk(userAlias);
            if (!isObject(plunderHistory)) return null;
            return plunderHistory.toJSON();
    
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
        unique: true,
        validate: {
            isUserAlias(value: unknown) {
                assertUserAlias(value, DatabaseError);
            }
        }
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

export class CustomPlunderTemplate extends Model<
    InferAttributes<CustomPlunderTemplate>,
    InferCreationAttributes<CustomPlunderTemplate>>
implements CustomPlunderTemplateType {
    declare readonly id: CreationOptional<number>;
    declare readonly alias: UserAlias;
    declare readonly type: string;
    declare readonly description: string | null;
    declare readonly units: CustomPlunderTemplateType['units'];

    public static async getCustomPlunderTemplates(alias: UserAlias): Promise<CustomPlunderTemplateType[] | null> {
        try {
            assertUserAlias(alias, DatabaseError);
            const templates = await CustomPlunderTemplate.findAll({ where: { alias } });
            return templates.map((template) => template.toJSON());

        } catch (err) {
            DatabaseError.catch(err);
            return null;
        };
    };

    public static async saveCustomPlunderTemplate(template: CustomPlunderTemplateType): Promise<boolean> {
        try {
            for (const [unit, amount] of Object.entries(template.units)) {
                assertInteger(amount);
                if (amount < 0) throw new DatabaseError(`A quantidade de ${unit} não pode ser negativa.`);
            };

            await sequelize.transaction(async (transaction) => {
                await CustomPlunderTemplate.upsert({ ...template }, { transaction });
            });

            return true;

        } catch (err) {
            DatabaseError.catch(err);
            return false;
        };
    };

    public static async destroyCustomPlunderTemplate(template: CustomPlunderTemplateType): Promise<boolean> {
        try {
            assertUserAlias(template.alias, DatabaseError);
            await sequelize.transaction(async (transaction) => {
                await CustomPlunderTemplate.destroy({ where: { alias: template.alias, type: template.type }, transaction });
            });

            return true;

        } catch (err) {
            DatabaseError.catch(err);
            return false;
        };
    };
};

CustomPlunderTemplate.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alias: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUserAlias(value: unknown) {
                assertUserAlias(value, DatabaseError);
            }
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    units: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, { sequelize, tableName: 'custom_plunder_template', timestamps: true });

export class DemolitionTemplate extends Model<
    InferAttributes<DemolitionTemplate>,
    InferCreationAttributes<DemolitionTemplate>>
implements DemolitionTemplateType {
    declare readonly id: CreationOptional<number>;
    declare readonly alias: UserAlias;
    declare readonly units: UnitsToDestroyWall;

    public static async getDemolitionTroopsConfig(alias: UserAlias): Promise<DemolitionTemplateType | null> {
        try {
            assertUserAlias(alias, DatabaseError);
            const demolitionTemplate = await DemolitionTemplate.findOne({ where: { alias } });
            if (!demolitionTemplate || !isObject(demolitionTemplate.units)) {
                return { alias, units: unitsToDestroyWall };
            };
            return demolitionTemplate.toJSON();

        } catch (err) {
            DatabaseError.catch(err);
            return null;
        };
    };

    public static async saveDemolitionTroopsConfig(template: DemolitionTemplateType): Promise<boolean> {
        try {
            await sequelize.transaction(async (transaction) => {
                await DemolitionTemplate.upsert({ ...template }, { transaction });
            });
            return true;

        } catch (err) {
            DatabaseError.catch(err);
            return false;
        };
    };

    public static async destroyDemolitionTroopsConfig(alias: UserAlias): Promise<boolean> {
        try {
            assertUserAlias(alias, DatabaseError);
            await sequelize.transaction(async (transaction) => {
                await DemolitionTemplate.destroy({ where: { alias }, transaction });
            });
            return true;

        } catch (err) {
            DatabaseError.catch(err);
            return false;
        };
    };
};

DemolitionTemplate.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isUserAlias(value: unknown) {
                assertUserAlias(value, DatabaseError);
            }
        }
    },
    units: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, { sequelize, tableName: 'demolition_template', timestamps: true });