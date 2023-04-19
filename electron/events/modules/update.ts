import { ipcMain, dialog } from 'electron';
import semverLte from 'semver/functions/lte';
import semverValid from 'semver/functions/valid';
import { MainProcessEventError } from '$electron/error';
import { AppConfig } from '$electron/interface';
import { showAppUpdate } from '$electron/app/modules';
import type { UpdateConfigType } from '$types/config';

export function setAppUpdateModuleEvents() {
    ipcMain.on('open-app-update-window', () => showAppUpdate());

    ipcMain.handle('is-ignored-app-version', async (_e, version: string): Promise<boolean> => {
        try {
            const row = (await AppConfig.findByPk('app_update'))?.toJSON();
            if (!row?.json) return false;
            
            const versionToIgnore = (row.json as UpdateConfigType).versionToIgnore;
            if (!semverValid(versionToIgnore)) return false;
            return semverLte(version, versionToIgnore);
            
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.on('show-update-available-dialog', async (_e, newVersion: string) => {
        try {
            if (!semverValid(newVersion)) {
                throw new MainProcessEventError(`Invalid version: ${newVersion}.`);
            };

            const { response } = await dialog.showMessageBox({
                type: 'info',
                title: 'Atualização disponível',
                message: 'Uma nova versão do Ares está disponível. Deseja atualizar agora?',
                buttons: ['Sim', 'Não', 'Ignorar esta versão'],
                defaultId: 0,
                cancelId: 1,
                noLink: true
            });

            if (response === 0) {
                showAppUpdate();
            } else if (response === 2) {
                let updateConfig: UpdateConfigType | null = null;
                const row = (await AppConfig.findByPk('app_update'))?.toJSON();
                if (row?.json) {
                    updateConfig = { ...row.json, versionToIgnore: newVersion };
                };

                updateConfig ??= { versionToIgnore: newVersion };
                await AppConfig.upsert({ name: 'app_update', json: updateConfig });
            };

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};