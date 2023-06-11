import { isUserAlias } from '$common/guards';
import { AliasInterfaceError } from '$electron/error';
import { patchPlunderConfig, patchPlunderHistory } from '$electron/interface/alias/plunder';
import type { PlunderConfig as PlunderConfigTable, PlunderHistory as PlunderHistoryTable } from '$electron/database/models/plunder';

import type {
    usePlunderConfigStore as usePlunderConfigStoreType,
    usePlunderHistoryStore as usePlunderHistoryStoreType
} from '$electron/interface';

/** Entende-se como "alias" o padrão `/^[a-z]+\d+_{ nome do jogador }/`. */
export function onAliasChange(
    PlunderConfig: typeof PlunderConfigTable,
    PlunderHistory: typeof PlunderHistoryTable,
    usePlunderConfigStore: typeof usePlunderConfigStoreType,
    usePlunderHistoryStore: typeof usePlunderHistoryStoreType
) {
    return async function(alias: UserAlias | null) {
        try {
            if (!isUserAlias(alias)) return;
            await Promise.all([
                patchPlunderConfig(alias, PlunderConfig, usePlunderConfigStore),
                patchPlunderHistory(alias, PlunderHistory, usePlunderHistoryStore)
            ]);
        } catch (err) {
            AliasInterfaceError.catch(err);
        };
    };
};