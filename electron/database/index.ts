import { Sequelize } from 'sequelize';
import { database } from '$electron/utils/files';

class SequelizeDatabase extends Sequelize {
    isClosed: boolean = false;
};

export const sequelize = new SequelizeDatabase({
    dialect: 'sqlite',
    storage: database,
    logging: false
});