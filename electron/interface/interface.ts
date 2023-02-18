import { assertInteger, assertString, isObject, isString, isNotNull } from '@tb-dev/ts-guard';
import { MainProcessError } from '$electron/error.js';
import { sequelize } from '$database/database.js';
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

export const cacheStore = setCacheStore(getUserAlias, setStoreState);
export const browserStore = setBrowserStore(cacheStore, savePlayerAsUser);
export const plunderStore = setPlunderStore();
export const plunderConfigStore = setPlunderConfigStore();
export const plunderHistoryStore = setPlunderHistoryStore();
export const unitStore = setUnitStore();
export const worldConfigStore = setWorldConfigStore();

/**
 * Retorna o alias do usuário, no padrão `/^[a-z]+\d+__USERID__\d+$/`.
 * Ele é usado para diferenciar tanto diferentes jogadores quanto diferentes mundos do mesmo jogador.
 * 
 * `^[a-z]+\d+` representa o mundo atual e `\d+$` representa o ID do usuário na tabela `user` do banco de dados.
 * @param playerName Nome do jogador.
 */
export async function getUserAlias(playerName?: string | null): Promise<UserAlias | null> {
    playerName ??= cacheStore.lastPlayer;
    if (!isString(playerName)) return null;

    const userId = await User.getUserID(playerName);
    assertInteger(userId, 'Não foi possível obter o alias porquê o ID do usuário é inválido.');

    const world = cacheStore.lastWorld;
    assertString(world, 'Não foi possível obter o alias porquê o mundo é inválido.');

    // É importante deixá-lo passar pelo Proxy em vez de usar diretamente `this`.
    const alias: UserAlias = `${world.toLowerCase()}__USERID__${userId.toString(10)}`;
    if (playerName === cacheStore.lastPlayer) cacheStore.lastUserAlias = alias;
    return alias;
};

export async function setStoreState() {
    try {
        const userAlias = await getUserAlias();
        if (!isUserAlias(userAlias)) return;

        const plunderConfig = (await PlunderConfig.findByPk(userAlias))?.toJSON();
        if (isObject(plunderConfig)) {
            for (const [key, value] of Object.entries(plunderConfig)) {
                if (key in plunderConfigStore) {
                    // A confirmação dos tipos é feita no Proxy.
                    (plunderConfigStore as any)[key] = value;
                };
            };
        };

        const plunderHistory = (await PlunderHistory.findByPk(userAlias))?.toJSON();
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
        };

    } catch (err) {
        MainProcessError.capture(err);
    };
};

export async function saveStoreState() {
    try {
        const { lastPlayer, lastWorld } = cacheStore;
        if (!isString(lastPlayer) || !isString(lastWorld)) return;

        const userAlias = await getUserAlias();
        if (!isUserAlias(userAlias)) return;

        await sequelize.transaction(async (transaction) => {
            await PlunderConfig.upsert({
                id: userAlias,
                ...plunderConfigStore
            }, { transaction });

            await PlunderHistory.upsert({
                id: userAlias,
                last: { ...plunderHistoryStore.last },
                total: { ...plunderHistoryStore.total }
            }, { transaction });
        });

    } catch (err) {
        await MainProcessError.capture(err);
    };
};

export async function getPlunderHistoryAsJSON(): Promise<PlunderHistory | null> {
    try {
        const result = await sequelize.transaction(async (transaction) => {
            const userAlias = await getUserAlias();
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

export async function savePlayerAsUser(name: string) {
    try {
        await sequelize.transaction(async (transaction) => {
            const user = await User.findOne({ where: { name }, transaction });
            if (isNotNull(user)) return;

            await User.create({ name }, { transaction });
        });
        
    } catch (err) {
        MainProcessError.capture(err);
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