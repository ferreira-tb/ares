import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

const playersTableMap = new Map<World, ReturnType<typeof createPlayersTable>>();

export async function getPlayersTable(world: World) {
    const table = playersTableMap.get(world);
    if (table) return table;

    const newTable = createPlayersTable(world);
    await newTable.sync();
    
    playersTableMap.set(world, newTable);
    return newTable;
};

function createPlayersTable(world: World) {
    const PlayersTable = class extends Model<InferAttributes<WorldPlayersModel>, InferCreationAttributes<WorldPlayersModel>> {};

    const tableName = `players_${world}`;
    const modelName = `Players${world.toUpperCase()}`;
    Object.defineProperty(PlayersTable, 'name', { value: modelName });

    PlayersTable.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ally: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        villages: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, { sequelize, tableName, modelName, timestamps: true });

    return PlayersTable;
};