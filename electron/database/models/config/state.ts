import { sequelize } from '$electron/database';
import { DatabaseError } from '$electron/error';
import { GameUrl } from '$common/constants';
import { getGameRegionUrl } from '$common/helpers';
import { isGameRegion } from '$common/guards';
import type { AppConfig as AppConfigTable } from '$electron/database/models/config';
import type { useCacheStore } from '$electron/interface';

export function getLastRegionGameUrl(AppConfig: typeof AppConfigTable) {
    return async function() {
        try {
            const appState = (await AppConfig.findByPk('app_state'))?.toJSON();
            if (!appState?.json) return GameUrl.Brazil;
            return getGameRegionUrl((appState.json as AppStateType).lastRegion);
        } catch (err) {
            DatabaseError.catch(err);
            return GameUrl.Brazil;
        };
    };
};

export function setGameRegion(AppConfig: typeof AppConfigTable) {
    return async function(cacheStore: ReturnType<typeof useCacheStore>) {
        try {
            const appState = (await AppConfig.findByPk('app_state'))?.toJSON();
            if (!appState?.json) return;
            const region = (appState.json as AppStateType).lastRegion;
            if (isGameRegion(region)) cacheStore.region = region;
        } catch (err) {
            DatabaseError.catch(err);
        };
    };
};

export function saveGameRegion(AppConfig: typeof AppConfigTable) {
    return async function(region: GameRegion) {
        try {
            const appState = (await AppConfig.findByPk('app_state'))?.toJSON();
            const json: AppStateType = appState?.json ?
                { ...appState.json, lastRegion: region } :
                { lastRegion: region };

            await sequelize.transaction(async () => {
                await AppConfig.upsert({ name: 'app_state', json });
            });
    
        } catch (err) {
            if (err instanceof Error) throw err;
        };
    };
};