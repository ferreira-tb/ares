import { DataTypes, Model } from 'sequelize';
import { isNotNull, isInteger } from '@tb-dev/ts-guard';
import { sequelize } from '$electron/database/database.js';
import { MainProcessError } from '$electron/error.js';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare readonly id: CreationOptional<number>;
    declare readonly name: string;

    // Cache contendo o nome e o id do usuário.
    private static readonly userCache: Map<string, number> = new Map();

    /** Número inteiro referente à chave primária do usuário na tabela do banco de dados. */
    public static async getUserID(playerName: string): Promise<number | null> {
        try {
            const user = this.userCache.get(playerName);
            if (isInteger(user)) return user;

            const userFromDatabase = await this.findOne({ where: { name: playerName } });
            if (isNotNull(userFromDatabase)) {
                this.userCache.set(playerName, userFromDatabase.id);
                return userFromDatabase.id;
            };

            return null;

        } catch (err) {
            MainProcessError.capture(err);
            return null;
        };
    };

    public static async savePlayerAsUser(playerName: string) {
        try {
            await sequelize.transaction(async (transaction) => {
                const user = await this.findOne({ where: { id: playerName }, transaction });
                if (isNotNull(user)) return;

                await this.create({ name: playerName }, { transaction });
            });
            
        } catch (err) {
            MainProcessError.capture(err);
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