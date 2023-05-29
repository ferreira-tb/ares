import cls from 'cls-hooked';
import { Sequelize } from 'sequelize';
import { database } from '$electron/utils/files';

const namespace = cls.createNamespace('ares');
Sequelize.useCLS(namespace);

class SequelizeDatabase extends Sequelize {
    isClosed: boolean = false;
};

export const sequelize = new SequelizeDatabase({
    dialect: 'sqlite',
    storage: database,
    logging: false
});