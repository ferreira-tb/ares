import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { DatabaseError } from '$electron/error';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare readonly id: CreationOptional<number>;
    declare readonly name: string;

    public static async savePlayerAsUser(playerName: string | null) {
        try {
            if (playerName === null) return;
            await sequelize.transaction(async (transaction) => {
                const name = encodeURIComponent(playerName);
                const user = await User.findOne({ where: { name }, transaction });
                if (user) return;
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
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, { sequelize, tableName: 'user', timestamps: true });