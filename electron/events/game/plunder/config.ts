import { ipcMain, webContents } from 'electron';
import { storeToRefs, watch } from 'mechanus';
import { sequelize } from '$electron/database';
import { MainProcessError } from '$electron/error';
import { useCacheStore, usePlunderConfigStore } from '$electron/stores';
import { PlunderConfig } from '$electron/database/models';
import { isUserAlias, assertUserAlias } from '$common/guards';
import { DefaultPlunderConfig } from '$common/templates';

export function setPlunderConfigEvents() {
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    const plunderConfigStore = usePlunderConfigStore();

    // Verifica se o Plunder está ativo.
    ipcMain.handle('plunder:is-active', (): boolean => plunderConfigStore.active);

    // Obtém as configurações do Plunder.
    ipcMain.handle('plunder:get-config', (): PlunderConfigType | null => {
        const alias = userAlias.value;
        if (isUserAlias(alias)) return plunderConfigStore.$raw();
        return null;
    });

    // Recebe as configurações do Plunder do painel ou do módulo de configuração e as salva no banco de dados.
    ipcMain.on('plunder:update-config', async (e, config: PlunderConfigType) => {
        try {
            const alias = userAlias.value;
            assertUserAlias(alias, MainProcessError);

            await sequelize.transaction(async () => {
                await PlunderConfig.upsert({ id: alias, ...plunderConfigStore });
            });

            plunderConfigStore.$patch(config);
            patchAllWebContents(config, e.sender);

        } catch (err) {
            MainProcessError.catch(err);
        };
    });

    watch(userAlias, async (alias) => {
        if (!isUserAlias(alias)) return;

        const previousConfig = (await PlunderConfig.findByPk(alias))?.toJSON();
        if (previousConfig) {
            plunderConfigStore.$patch(previousConfig);
            patchAllWebContents(previousConfig);
        } else {
            const defaultConfig = new DefaultPlunderConfig();
            plunderConfigStore.$patch(defaultConfig);
            patchAllWebContents(defaultConfig);
        };
    });
};

/** Comunica a mudança aos processos diferentes daquele que enviou os dados. */
function patchAllWebContents(data: PlunderConfigType, sender?: Electron.WebContents) {
    const channel = 'plunder:patch-config';
    for (const contents of webContents.getAllWebContents()) {
        if (sender && contents === sender) continue;
        contents.send(channel, data);
    };
};