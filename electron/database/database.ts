import { app } from 'electron';
import { join } from 'path';
import { Sequelize } from '@sequelize/core';

export const db = new Sequelize({
    dialect: 'sqlite',
    storage: join(app.getPath('userData'), 'ares.db')
});