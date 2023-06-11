import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

const alliesTableMap = new Map<World, ReturnType<typeof createAlliesTable>>();

export async function getAlliesTable(world: World) {
    const table = alliesTableMap.get(world);
    if (table) return table;

    const newTable = createAlliesTable(world);
    await newTable.sync();
    
    alliesTableMap.set(world, newTable);
    return newTable;
};

function createAlliesTable(world: World) {
    const AlliesTable = class extends Model<InferAttributes<WorldAlliesModel>, InferCreationAttributes<WorldAlliesModel>> {};

    const tableName = `allies_${world}`;
    const modelName = `Allies${world.toUpperCase()}`;
    Object.defineProperty(AlliesTable, 'name', { value: modelName });

    AlliesTable.init({
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
        tag: {
            type: DataTypes.STRING,
            allowNull: false
        },
        members: {
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
        allPoints: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, { sequelize, tableName, modelName, timestamps: true });

    return AlliesTable;
};