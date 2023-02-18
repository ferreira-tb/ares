import { isObject, isNotNull } from '@tb-dev/ts-guard';
import { MainProcessError } from '$electron/error.js';
import { sequelize } from '$database/database.js';
import { assertPanelWindow } from '$electron/utils/helpers.js';
import { isUserAlias } from '$electron/utils/guards.js';

import { UserConfig } from '$tables/config.js';
import { ErrorLog, DOMErrorLog } from '$tables/error.js';
import { PlunderHistory, PlunderConfig } from '$tables/plunder.js';
import { User } from '$tables/user.js';

import { setPlunderStore, setPlunderConfigStore, setPlunderHistoryStore } from '$stores/plunder.js';
import { setBrowserStore } from '$stores/browser.js';
import { setCacheStore } from '$stores/cache.js';
import { setUnitStore } from '$stores/units.js';
import { setWorldConfigStore } from '$stores/world.js';

import type { PlunderedAmount, PlunderHistoryType } from '$types/plunder.js';
import type { UserAlias } from '$types/electron.js';

export const cacheStore = setCacheStore(setStoreState);
export const browserStore = setBrowserStore(cacheStore, savePlayerAsUser);
export const plunderStore = setPlunderStore();
export const plunderConfigStore = setPlunderConfigStore();
export const plunderHistoryStore = setPlunderHistoryStore();
export const unitStore = setUnitStore();
export const worldConfigStore = setWorldConfigStore();

/**
 * Define o estado das stores de acordo com o alias atual.
 * 
 * Essa função deve ser chamada sempre que o alias for alterado.
 * A responsabilidade de chamar essa função é do Proxy `cacheStore`.
 * 
 * Entende-se como "alias" o padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`.
 */
async function setStoreState(alias: UserAlias) {
    try {
        const panelWindow = assertPanelWindow();

        const plunderConfig = (await PlunderConfig.findByPk(alias))?.toJSON();
        if (isObject(plunderConfig)) {
            for (const [key, value] of Object.entries(plunderConfig)) {
                if (key in plunderConfigStore) {
                    // A confirmação dos tipos é feita no Proxy.
                    (plunderConfigStore as any)[key] = value;
                };
            };

            // Atualiza o painel com as configurações para o alias atual.
            panelWindow.webContents.send('update-plunder-config', plunderConfig);
        };

        const plunderHistory = (await PlunderHistory.findByPk(alias))?.toJSON();
        if (isObject(plunderHistory)) {
            type PlunderHistoryKeys = keyof PlunderHistoryType;
            for (const [key, value] of Object.entries(plunderHistory) as [PlunderHistoryKeys, PlunderedAmount][]) {
                if (!isObject(value)) continue;

                for (const [innerKey, innerValue] of Object.entries(value) as [keyof PlunderedAmount, number][]) {
                    if (innerKey in plunderHistoryStore[key]) {
                        plunderHistoryStore[key][innerKey] = innerValue;
                    };
                };
            };

            // Se o Plunder estiver ativo para o alias atual, atualiza o painel com o histórico de recursos.
            // Isso permite que ele continue de onde parou.
            if (isObject(plunderConfig) && plunderConfig.active === true) {
                panelWindow.webContents.send('update-plunder-history', plunderHistory);
            };
        };

    } catch (err) {
        MainProcessError.capture(err);
    };
};

export async function getPlunderHistoryAsJSON(): Promise<PlunderHistory | null> {
    try {
        const result = await sequelize.transaction(async (transaction) => {
            const userAlias = cacheStore.userAlias;
            if (!isUserAlias(userAlias)) return null;
            
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

export async function savePlayerAsUser(playerName: string) {
    try {
        await sequelize.transaction(async (transaction) => {
            const name = encodeURIComponent(playerName);
            const user = await User.findOne({ where: { name }, transaction });
            if (isNotNull(user)) return;
            await User.create({ name }, { transaction });
        });
        
    } catch (err) {
        MainProcessError.capture(err);
    };
};

export type { setStoreState as SetStoreState };

export {
    UserConfig,
    ErrorLog,
    DOMErrorLog,
    PlunderHistory,
    PlunderConfig,
    User
};