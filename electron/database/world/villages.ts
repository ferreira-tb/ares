import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertWorld } from '$global/guards';
import { DatabaseError } from '$electron/error';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { World } from '$types/game';
import type { WorldVillagesModel } from '$types/world';

export const worldVillagesTablesMap = new Proxy(new Map<World, ReturnType<typeof createWorldVillagesTable>>(), {
    get(target, key) {
        assertWorld(key, DatabaseError, `${String(key)} is not a valid world`);
        if (target.has(key)) return target.get(key);

        const table = createWorldVillagesTable(key);
        target.set(key, table);
        return table;
    }
});

function createWorldVillagesTable(world: World) {
    const VillagesTable = class extends Model<InferAttributes<WorldVillagesModel>, InferCreationAttributes<WorldVillagesModel>> {};

    const tableName = `world_villages_${world}`;
    const modelName = `WorldVillages${world.toUpperCase()}`;
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