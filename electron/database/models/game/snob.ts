import { DataTypes, Model } from 'sequelize';
import { Kronos } from '@tb-dev/kronos';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$common/guards';
import { DatabaseError } from '$electron/error';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export class SnobConfig extends Model<InferAttributes<SnobConfig>, InferCreationAttributes<SnobConfig>> implements SnobConfigType {
    declare readonly id: UserAlias;
    declare readonly active: boolean;
    declare readonly mode: 'group' | 'single';
    declare readonly delay: number;
    declare readonly timeUnit: 'hours' | 'minutes' | 'seconds';
    declare readonly village: CreationOptional<number | null>;
    declare readonly group: CreationOptional<number>;
    declare readonly coins: number;
    
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
    },
    coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, { sequelize, tableName: 'snob_config', timestamps: true });