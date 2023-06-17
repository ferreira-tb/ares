import { DataTypes, Model } from 'sequelize';
import { Kronos } from '@tb-dev/kronos';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$common/guards';
import { DatabaseError } from '$electron/error';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export class SnobConfig extends Model<InferAttributes<SnobConfig>, InferCreationAttributes<SnobConfig>> implements SnobConfigType {
    declare public readonly id: UserAlias;
    declare public readonly active: boolean;
    declare public readonly mode: 'group' | 'single';
    declare public readonly delay: number;
    declare public readonly timeUnit: 'hours' | 'minutes' | 'seconds';
    declare public readonly village: CreationOptional<number | null>;
    declare public readonly group: CreationOptional<number>;
};

SnobConfig.init({
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
        type: DataTypes.ENUM('group', 'single'),
        allowNull: false,
        defaultValue: 'single'
    },
    delay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Kronos.Minute * 5
    },
    timeUnit: {
        type: DataTypes.ENUM('hours', 'minutes', 'seconds'),
        allowNull: false,
        defaultValue: 'minutes'
    },
    village: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    group: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, { sequelize, tableName: 'snob_config', timestamps: true });

export class SnobHistory extends Model<InferAttributes<SnobHistory>, InferCreationAttributes<SnobHistory>> implements SnobHistoryType {
    declare public readonly id: UserAlias;
    declare public readonly coins: number;
    declare public readonly villages: CreationOptional<SnobHistoryType['villages']>;
};

SnobHistory.init({
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
    coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    villages: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    }
}, { sequelize, tableName: 'snob_history', timestamps: true });