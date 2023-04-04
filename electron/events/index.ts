import semverLte from 'semver/functions/lte';
import semverValid from 'semver/functions/valid';
import { app, ipcMain, dialog } from 'electron';
import { isObject } from '@tb-dev/ts-guard';
import { setPlunderEvents } from '$electron/events/plunder';
import { setErrorEvents } from '$electron/events/error';
import { setPanelEvents } from '$electron/events/panel';
import { setDeimosEvents } from '$electron/events/deimos';
import { setModuleEvents } from '$electron/events/modules';
import { setMainWindowEvents } from '$electron/events/window';
import { setBrowserViewEvents } from '$electron/events/view';
import { setGroupsEvents } from '$electron/events/groups';
import { setMenuEvents } from '$electron/events/menu';
import { setBrowserEvents } from '$electron/events/browser';
import { setConfigEvents } from '$electron/events/config';
import { isUserAlias } from '$electron/utils/guards';
import { MainProcessEventError } from '$electron/error';
import { openAresWebsite, openIssuesWebsite, openRepoWebsite } from '$electron/app/modules';
import { useCacheStore, useWorldConfigStore, worldUnitsMap, AppConfig } from '$interface/index';
import { getPlayerNameFromAlias, extractWorldUnitsFromMap } from '$electron/utils/helpers';
import type { UserAlias } from '$types/electron';
import type { AppUpdateConfigType } from '$types/config';

export function setEvents() {
    const cacheStore = useCacheStore();
    const worldConfigStore = useWorldConfigStore();
    
    // Geral.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());
    ipcMain.handle('user-alias', () => cacheStore.userAlias);
    ipcMain.handle('user-data-path', () => app.getPath('userData'));
    ipcMain.handle('user-desktop-path', () => app.getPath('desktop'));
    ipcMain.handle('is-dev', () => process.env.ARES_MODE === 'dev');

    ipcMain.handle('is-ignored-app-version', async (_e, version: string): Promise<boolean> => {
        try {
            const row = (await AppConfig.findByPk('app_update'))?.toJSON();
            if (!row || !isObject<AppUpdateConfigType>(row.json)) return false;
            
            const versionToIgnore = row.json.versionToIgnore;
            if (!semverValid(versionToIgnore)) return false;
            return semverLte(version, versionToIgnore);
            
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.handle('show-update-available-dialog', async (_e, newVersion: string): Promise<boolean> => {
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
    
            if (response === 2) {
                let updateConfig: AppUpdateConfigType;
                const row = (await AppConfig.findByPk('app_update'))?.toJSON();
                if (row && isObject<AppUpdateConfigType>(row.json)) {
                    updateConfig = { ...row.json, versionToIgnore: newVersion };
                };

                updateConfig ??= { versionToIgnore: newVersion };
                await AppConfig.upsert({ name: 'app_update', json: updateConfig });
            };
    
            return response === 0;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    // Website.
    ipcMain.on('open-ares-website', () => openAresWebsite());
    ipcMain.on('open-github-repo', () => openRepoWebsite());
    ipcMain.on('open-github-issues', () => openIssuesWebsite());

    // Jogo.
    ipcMain.handle('current-world', () => cacheStore.world);
    ipcMain.handle('current-world-config', () => ({ ...worldConfigStore }));
    ipcMain.handle('current-world-units', () => extractWorldUnitsFromMap(worldUnitsMap));
    ipcMain.handle('is-archer-world', () => worldConfigStore.archer);

    ipcMain.handle('player-name', (_e, alias: UserAlias): string | null => {
        if (!isUserAlias(alias)) return cacheStore.player;
        return getPlayerNameFromAlias(alias);
    });

    // Outros eventos.
    setConfigEvents();
    setMainWindowEvents();
    setBrowserEvents();
    setBrowserViewEvents();
    setPanelEvents();
    setMenuEvents();
    setPlunderEvents();
    setErrorEvents();
    setDeimosEvents();
    setModuleEvents();
    setGroupsEvents();
};