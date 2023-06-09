import { isUserAlias } from '$common/guards';
import { AliasInterfaceError } from '$electron/error';
import { patchGroups } from '$electron/interface/alias/groups';
import { patchPlunderConfig, patchPlunderHistory } from '$electron/interface/alias/plunder';
import type { PlunderConfig as PlunderConfigTable, PlunderHistory as PlunderHistoryTable } from '$electron/database/models/plunder';
import type { VillageGroups as VillageGroupsTable } from '$electron/database/models/game';

import type {
    useGroupsStore as useGroupsStoreType,
    usePlunderConfigStore as usePlunderConfigStoreType,
    usePlunderHistoryStore as usePlunderHistoryStoreType
} from '$electron/interface';

/** Entende-se como "alias" o padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`. */
export function onAliasChange(
    PlunderConfig: typeof PlunderConfigTable,
    PlunderHistory: typeof PlunderHistoryTable,
    usePlunderConfigStore: typeof usePlunderConfigStoreType,
    usePlunderHistoryStore: typeof usePlunderHistoryStoreType,

    VillageGroups: typeof VillageGroupsTable,
    useGroupsStore: typeof useGroupsStoreType
) {
    return async function(alias: UserAlias | null) {
        try {
            if (!isUserAlias(alias)) return;
            await Promise.all([
                patchGroups(alias, VillageGroups, useGroupsStore),
                patchPlunderConfig(alias, PlunderConfig, usePlunderConfigStore),
                patchPlunderHistory(alias, PlunderHistory, usePlunderHistoryStore)
            ]);
        } catch (err) {
            AliasInterfaceError.catch(err);
        };
    };
};