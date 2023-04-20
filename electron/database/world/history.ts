import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { DatabaseError } from '$electron/error';
import { assertWorld } from '$global/guards';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { World } from '$types/game';
import type { WorldFetchHistoryType } from '$types/world';

export class WorldFetchHistory extends Model<
    InferAttributes<WorldFetchHistory>,
    InferCreationAttributes<WorldFetchHistory>
> implements WorldFetchHistoryType {
    declare readonly world: World;
    declare readonly village: number | null;
    declare readonly player: number | null;
    declare readonly ally: number | null;
};

WorldFetchHistory.init({
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
        allowNull: true
    },
    player: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ally: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { sequelize, tableName: 'world_fetch_history', timestamps: false });