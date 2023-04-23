import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$global/guards';
import { DatabaseError } from '$electron/error';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import type { UserAlias } from '$types/game';
import type { PlunderHistoryType } from '$types/plunder';
import type { usePlunderHistoryStore } from '$electron/interface';

export class PlunderHistory extends Model<InferAttributes<PlunderHistory>, InferCreationAttributes<PlunderHistory>> implements PlunderHistoryType {
    declare readonly id: UserAlias;
    declare readonly wood: number;
    declare readonly stone: number;
    declare readonly iron: number;
    declare readonly attackAmount: number;
    declare readonly destroyedWalls: number;
    declare readonly villages: CreationOptional<PlunderHistoryType['villages']>;

    public static async saveHistory(alias: UserAlias, plunderHistoryStore: ReturnType<typeof usePlunderHistoryStore>) {
        try {
            // Na store, `villages` é um Proxy, então é necessário clonar o objeto antes de salvá-lo.
            const villages = { ...plunderHistoryStore.villages };
            await sequelize.transaction(async (transaction) => {
                await PlunderHistory.upsert({
                    id: alias,
                    ...plunderHistoryStore,
                    villages
                }, { transaction });
            });

        } catch (err) {
            DatabaseError.catch(err);
        };
    };
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
        allowNull: true
    }
}, { sequelize, tableName: 'plunder_history', timestamps: false });