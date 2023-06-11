import { storeToRefs } from 'mechanus';
import { fetchVillageGroups, patchVillageGroups } from '$electron/utils/groups';
import { sequelize } from '$electron/database';
import { AliasInterfaceError } from '$electron/error';
import type { VillageGroups as VillageGroupsTable } from '$electron/database/models/game';
import type { useGroupsStore as useGroupsStoreType } from '$electron/interface';

export async function patchGroups(
    alias: UserAlias,
    VillageGroups: typeof VillageGroupsTable,
    useGroupsStore: typeof useGroupsStoreType
) {
    try {
        const groupsStore = useGroupsStore();
        const { all } = storeToRefs(groupsStore);

        // Obtém os grupos do banco de dados.
        const villageGroups = await VillageGroups.findByPk(alias);
        const groups = new Set(villageGroups?.allGroups ?? []);
        if (groups.size === 0) {
            (await fetchVillageGroups()).forEach((group) => {
                groups.add(group);
            });
        };

        patchVillageGroups(groups, all);
        
        await sequelize.transaction(async () => {
            await VillageGroups.upsert({ id: alias, allGroups: [...groups] });
        });

    } catch (err) {
        AliasInterfaceError.catch(err);
    };
};