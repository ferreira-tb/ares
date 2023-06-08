import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

const villagesTableMap = new Map<World, ReturnType<typeof createVillagesTable>>();

export async function getVillagesTable(world: World) {
    const table = villagesTableMap.get(world);
    if (table) return table;

    const newTable = createVillagesTable(world);
    await newTable.sync();
    
    villagesTableMap.set(world, newTable);
    return newTable;
};

function createVillagesTable(world: World) {
    const VillagesTable = class extends Model<InferAttributes<WorldVillagesModel>, InferCreationAttributes<WorldVillagesModel>> {};

    const tableName = `villages_${world}`;
    const modelName = `Villages${world.toUpperCase()}`;
    Object.defineProperty(VillagesTable, 'name', { value: modelName });

    VillagesTable.init({
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
        x: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        y: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        player: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, { sequelize, tableName, modelName, timestamps: true });

    return VillagesTable;
};