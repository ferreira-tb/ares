import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$common/guards';
import { DatabaseError } from '$electron/error';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

export class VillageGroups extends Model<InferAttributes<VillageGroups>, InferCreationAttributes<VillageGroups>> implements VillageGroupsType {
    declare readonly id: UserAlias;
    declare readonly allGroups: VillageGroup[];
};

VillageGroups.init({
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

    allGroups: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    }
}, { sequelize, tableName: 'village_groups', timestamps: true });