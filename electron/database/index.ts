import { Sequelize } from 'sequelize';
import { database } from '$electron/utils/files';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: database,
    logging: false
});