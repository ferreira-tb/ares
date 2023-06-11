import { ipcMain, webContents } from 'electron';
import { sequelize } from '$electron/database';
import { MainProcessEventError } from '$electron/error';
import { useCacheStore, usePlunderConfigStore, PlunderConfig } from '$electron/interface';
import { isUserAlias, assertUserAlias } from '$common/guards';

export function setPlunderConfigEvents() {
    const cacheStore = useCacheStore();
    const plunderConfigStore = usePlunderConfigStore();

    // Verifica se o Plunder está ativo.
    ipcMain.handle('plunder:is-active', () => plunderConfigStore.active);

    // Obtém as configurações do Plunder.
    ipcMain.handle('plunder:get-config', () => {
        const alias = cacheStore.userAlias;
        if (isUserAlias(alias)) return { ...plunderConfigStore };
        return null;
    });

    // Recebe as configurações do Plunder do painel ou do módulo de configuração e as salva no banco de dados.
    ipcMain.on('plunder:update-config', async <T extends keyof typeof plunderConfigStore>(
        e: Electron.IpcMainEvent, key: T, value: typeof plunderConfigStore[T]
    ) => {
        try {
            if (!(key in plunderConfigStore)) return;
            const previousValue = plunderConfigStore[key];
            if (previousValue === value) return;
            plunderConfigStore[key] = value;

            // Comunica a mudança aos processos diferentes daquele que enviou os dados.
            for (const contents of webContents.getAllWebContents()) {
                if (contents !== e.sender) {
                    contents.send('plunder:config-updated', key, value);
                };
            };

            const userAlias = cacheStore.userAlias;
            assertUserAlias(userAlias, MainProcessEventError);

            await sequelize.transaction(async () => {
                await PlunderConfig.upsert({ id: userAlias, ...plunderConfigStore });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};