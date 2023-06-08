import { ipcMain, dialog } from 'electron';
import semverLte from 'semver/functions/lte';
import semverValid from 'semver/functions/valid';
import { MainProcessEventError } from '$electron/error';
import { appConfig } from '$electron/stores';
import { showAppUpdate } from '$electron/modules';

export function setAppUpdateModuleEvents() {
    ipcMain.on('app-update:open', () => showAppUpdate());

    ipcMain.handle('app-update:is-ignored-version', (_e, version: string): boolean => {
        try {
            const versionToIgnore = appConfig.get('update').versionToIgnore;
            if (!versionToIgnore || !semverValid(versionToIgnore)) return false;
            return semverLte(version, versionToIgnore);
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.on('app-update:update-available-dialog', async (_e, newVersion: string) => {
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
                appConfig.set('update', { versionToIgnore: newVersion });
            };

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};