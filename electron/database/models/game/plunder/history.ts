import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$common/guards';
import { DatabaseError } from '$electron/error';
import { usePlunderHistoryStore } from '$electron/stores';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export class PlunderHistory extends Model<InferAttributes<PlunderHistory>, InferCreationAttributes<PlunderHistory>> implements PlunderHistoryType {
    declare public readonly id: UserAlias;
    declare public readonly wood: number;
    declare public readonly stone: number;
    declare public readonly iron: number;
    declare public readonly attackAmount: number;
    declare public readonly destroyedWalls: number;
    declare public readonly villages: CreationOptional<PlunderHistoryType['villages']>;

    public static async saveHistory(alias: UserAlias) {
        try {
            const plunderHistoryStore = usePlunderHistoryStore();
            const villages = plunderHistoryStore.unproxifyVillages();
            await sequelize.transaction(async () => {
                await PlunderHistory.upsert({
                    id: alias,
                    ...plunderHistoryStore.$raw({ actions: false }),
                    villages
                });
            });

        } catch (err) {
            DatabaseError.catch(err);
        }
    }
}

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
    wood: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    stone: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    iron: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    attackAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    destroyedWalls: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    villages: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    }
}, { sequelize, tableName: 'plunder_history', timestamps: false });