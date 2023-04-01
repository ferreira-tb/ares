import { app } from 'electron';
import { join } from 'path';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: join(app.getPath('userData'), 'ares.db'),
    logging: false
});