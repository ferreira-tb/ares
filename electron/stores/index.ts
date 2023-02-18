import { assertInteger, assertString, isObject, isString } from '@tb-dev/ts-guard';
import { sequelize } from '$electron/database/database.js';
import { MainProcessError } from '$electron/error.js';
import { User, PlunderConfig, PlunderHistory } from '$tables/index.js';
import { setPlunderStore, setPlunderConfigStore, setPlunderHistoryStore } from '$electron/stores/plunder.js';
import { setBrowserStore } from '$electron/stores/browser.js';
import { setCacheStore } from '$electron/stores/cache.js';
import { setUnitStore } from '$electron/stores/units.js';
import { setWorldConfigStore } from '$electron/stores/world.js';
import type { PlunderedAmount, PlunderHistoryType } from '$types/plunder.js';
import type { UserAlias } from '$types/electron.js';

export const cacheStore = setCacheStore(getUserAlias, setStoreState);
export const browserStore = setBrowserStore(cacheStore, User);
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
export async function getUserAlias(playerName?: string | null): Promise<UserAlias> {
    if (!isString(playerName)) playerName = cacheStore.lastPlayer;
    assertString(playerName, 'Não é possível obter o alias porquê o nome do jogador é inválido.');

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