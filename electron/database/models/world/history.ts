import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { DatabaseError } from '$electron/error';
import { assertWorld } from '$common/guards';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export class WorldDataFetchHistory extends Model<
    InferAttributes<WorldDataFetchHistory>,
    InferCreationAttributes<WorldDataFetchHistory>
> implements WorldDataFetchHistoryType {
    declare public readonly world: World;
    declare public readonly village: CreationOptional<number>;
    declare public readonly player: CreationOptional<number>;
    declare public readonly ally: CreationOptional<number>;
};

WorldDataFetchHistory.init({
    world: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            isWorld(value: unknown) {
                assertWorld(value, DatabaseError, `${value} is not a valid world`);
            }
        }
    },
    village: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    player: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    ally: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, { sequelize, tableName: 'world_fetch_history', timestamps: false });