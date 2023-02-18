import { isObject } from '@tb-dev/ts-guard';
import { MainProcessError } from '$electron/error.js';
import { getUserAlias } from '$electron/stores/index.js';
import { sequelize } from '$electron/database/database.js';
import { UserConfig } from '$tables/config.js';
import { ErrorLog, DOMErrorLog } from '$tables/error.js';
import { PlunderHistory, PlunderConfig } from '$tables/plunder.js';
import { User } from '$tables/user.js';

export async function getPlunderHistoryAsJSON(): Promise<PlunderHistory | null> {
    try {
        const result = await sequelize.transaction(async (transaction) => {
            const userAlias = await getUserAlias();
            const plunderHistory = await PlunderHistory.findByPk(userAlias, { transaction });
            if (!isObject(plunderHistory)) return null;

            return plunderHistory.toJSON();
        });

        return result as PlunderHistory | null;

    } catch (err) {
        MainProcessError.capture(err);
        return null;
    };
};

export {
    UserConfig,
    ErrorLog,
    DOMErrorLog,
    PlunderHistory,
    PlunderConfig,
    User
};