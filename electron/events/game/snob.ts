import { ipcMain, webContents } from 'electron';
import { storeToRefs, watch } from 'mechanus';
import { useCacheStore, SnobConfig } from '$electron/interface';
import { sequelize } from '$electron/database';
import { MainProcessEventError } from '$electron/error';
import { isUserAlias } from '$common/guards';

export function setSnobEvents() {
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    ipcMain.on('snob:update-config', async (e, config: SnobConfigType) => {
        try {
            const alias = userAlias.value;
            if (!isUserAlias(alias)) return;

            await sequelize.transaction(async () => {
                await SnobConfig.upsert({ id: alias, ...config });
            });

            for (const contents of webContents.getAllWebContents()) {
                if (contents !== e.sender) {
                    contents.send('snob:patch-config', config);
                };
            };

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    watch(userAlias, async (alias) => {
        if (!isUserAlias(alias)) return;
        const snobConfig = (await SnobConfig.findByPk(alias))?.toJSON();
        if (snobConfig) {
            for (const contents of webContents.getAllWebContents()) {
                contents.send('snob:patch-config', snobConfig);
            };
        };
    });
};