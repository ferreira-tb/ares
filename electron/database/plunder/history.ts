import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { isUserAlias, assertUserAlias } from '$global/guards';
import { DatabaseError } from '$electron/error';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { UserAlias } from '$types/electron';
import type { useCacheStore } from '$electron/interface';
import type { PlunderHistoryType, PlunderAttackDetails } from '$types/plunder';

export class PlunderHistory extends Model<InferAttributes<PlunderHistory>, InferCreationAttributes<PlunderHistory>> implements PlunderHistoryType {
    declare readonly id: UserAlias;
    declare readonly last: PlunderAttackDetails;
    declare readonly total: PlunderAttackDetails;

    public static async getHistoryAsJSON(cacheStore: ReturnType<typeof useCacheStore>): Promise<PlunderHistoryType | null> {
        try {
            const userAlias = cacheStore.userAlias;
            if (!isUserAlias(userAlias)) return null;

            const plunderHistory = await PlunderHistory.findByPk(userAlias);
            return plunderHistory ? plunderHistory.toJSON() : null;
    
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