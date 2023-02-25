import { UserConfig } from '$tables/config.js';
import { ErrorLog, DOMErrorLog, MainProcessErrorLog } from '$tables/error.js';
import { PlunderHistory, PlunderConfig } from '$tables/plunder.js';
import { User } from '$tables/user.js';
import { WorldConfig, WorldUnit } from '$tables/world.js';

import { setPlunderProxy, setPlunderConfigProxy, setPlunderHistoryProxy } from '$stores/plunder.js';
import { setAresProxy } from '$stores/ares.js';
import { setCacheProxy } from '$stores/cache.js';
import { setUnitsProxy } from '$stores/units.js';
import { setFeaturesProxy } from '$stores/features.js';
import { setPlayerProxy } from '$stores/player.js';
import { setWorldConfigProxy, setWorldUnitProxy } from '$stores/world.js';
import { setCurrentVillageProxy } from '$stores/village.js';

import { setAliasProxyState } from '$interface/alias.js';
import { setWorldProxyState } from '$interface/world.js';
import { catchError } from '$interface/error.js';

import { MainProcessError } from '$electron/error.js';

export const aresProxy = setAresProxy();
export const plunderProxy = setPlunderProxy();
export const plunderConfigProxy = setPlunderConfigProxy();
export const plunderHistoryProxy = setPlunderHistoryProxy();
export const featuresProxy = setFeaturesProxy();
export const unitProxy = setUnitsProxy();
export const playerProxy = setPlayerProxy(User);
export const currentVillageProxy = setCurrentVillageProxy();
export const worldConfigProxy = setWorldConfigProxy();
export const worldUnitProxy = setWorldUnitProxy();

const aliasArgs = [PlunderConfig, PlunderHistory, plunderConfigProxy, plunderHistoryProxy] as const;
const worldArgs = [WorldConfig, WorldUnit, worldConfigProxy, worldUnitProxy] as const;

export const cacheProxy = setCacheProxy(
    setAliasProxyState(...aliasArgs),
    setWorldProxyState(...worldArgs)
);

// Erros.
MainProcessError.catch = catchError(aresProxy, MainProcessErrorLog);

export {
    UserConfig,
    ErrorLog,
    DOMErrorLog,
    MainProcessErrorLog,
    PlunderHistory,
    PlunderConfig,
    User,
    WorldConfig,
    WorldUnit
};