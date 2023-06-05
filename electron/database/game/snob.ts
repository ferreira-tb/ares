import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$shared/guards';
import { DatabaseError } from '$electron/error';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export class SnobConfig extends Model<InferAttributes<SnobConfig>, InferCreationAttributes<SnobConfig>> implements SnobConfigType {
    declare readonly id: UserAlias;
    declare readonly active: boolean;
    declare readonly mode: 'group' | 'single';
    declare readonly village: CreationOptional<number>;
    declare readonly group: CreationOptional<number>;
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
    village: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    group: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
}, { sequelize, tableName: 'snob_config', timestamps: true });