import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$global/guards';
import { DatabaseError } from '$electron/error';
import type { VillageGroup, VillageGroupsType } from '$types/game';
import type { UserAlias } from '$types/electron';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

export class VillageGroups extends Model<InferAttributes<VillageGroups>, InferCreationAttributes<VillageGroups>> implements VillageGroupsType {
    declare readonly id: UserAlias;
    declare allGroups: VillageGroup[];
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
        allowNull: false
    }
}, { sequelize, tableName: 'village_groups', timestamps: true });