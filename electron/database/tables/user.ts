import { isNotNull } from '@tb-dev/ts-guard';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$database/database.js';
import { DatabaseError } from '$electron/error.js';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare readonly id: CreationOptional<number>;
    declare readonly name: string;

    public static async savePlayerAsUser(playerName: string) {
        try {
            await sequelize.transaction(async (transaction) => {
                const name = encodeURIComponent(playerName);
                const user = await User.findOne({ where: { name }, transaction });
                if (isNotNull(user)) return;
                await User.create({ name }, { transaction });
            });
            
        } catch (err) {
            DatabaseError.catch(err);
        };
    };
};

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, { sequelize, tableName: 'user', timestamps: true });