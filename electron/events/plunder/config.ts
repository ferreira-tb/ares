import { ipcMain, webContents } from 'electron';
import { isKeyOf } from '@tb-dev/ts-guard';
import { sequelize } from '$electron/database';
import { MainProcessEventError } from '$electron/error';
import { useCacheStore, usePlunderConfigStore, PlunderConfig } from '$electron/interface';
import { isUserAlias, assertUserAlias } from '$electron/utils/guards';
import type { IpcMainEvent } from 'electron';

export function setPlunderConfigEvents() {
    const cacheStore = useCacheStore();
    const plunderConfigStore = usePlunderConfigStore();

    // Verifica se o Plunder está ativo.
    ipcMain.handle('is-plunder-active', () => plunderConfigStore.active);

    // Obtém as configurações do Plunder.
    ipcMain.handle('get-plunder-config', () => {
        const alias = cacheStore.userAlias;
        if (isUserAlias(alias)) return { ...plunderConfigStore };
        return null;
    });

    // Recebe as configurações do Plunder do painel ou do módulo de configuração e as salva no banco de dados.
    ipcMain.on('update-plunder-config', async <T extends keyof typeof plunderConfigStore>(
        e: IpcMainEvent, key: T, value: typeof plunderConfigStore[T]
    ) => {
        try {
            if (!isKeyOf(key, plunderConfigStore)) return;
            const previousValue = plunderConfigStore[key];
            if (previousValue === value) return;

            // A confirmação dos tipos é feita na store.
            Reflect.set(plunderConfigStore, key, value);

            // Comunica a mudança aos processos diferentes daquele que enviou os dados.
            for (const contents of webContents.getAllWebContents()) {
                if (contents !== e.sender) {
                    contents.send('plunder-config-updated', key, value);
                };
            };

            const userAlias = cacheStore.userAlias;
            assertUserAlias(userAlias, MainProcessEventError);

            await sequelize.transaction(async (transaction) => {
                await PlunderConfig.upsert({ id: userAlias, ...plunderConfigStore }, { transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};