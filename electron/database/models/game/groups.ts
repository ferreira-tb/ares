import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$common/guards';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export class VillageGroups extends Model<
    InferAttributes<VillageGroups>,
    InferCreationAttributes<VillageGroups>
> implements VillageGroupsType {
    declare public readonly id: UserAlias;
    declare public readonly allGroups: VillageGroup[];

    declare public readonly createdAt: CreationOptional<Date>;
    declare public readonly updatedAt: CreationOptional<Date>;
}

VillageGroups.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            isUserAlias(value: unknown) {
                assertUserAlias(value);
            }
        }
    },

    allGroups: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, { sequelize, tableName: 'village_groups', timestamps: true });