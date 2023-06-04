import { app, dialog, ipcMain, Menu } from 'electron';
import { storeToRefs } from 'mechanus';
import { getMainWindow } from '$electron/utils/helpers';
import { getMainViewWebContents } from '$electron/utils/view';
import { showErrorLog, openIssuesWebsite } from '$electron/modules';
import { AppConfig, useCacheStore } from '$electron/interface';
import { MainProcessError } from '$electron/error';
import { getGameRegionUrl } from '$shared/helpers';

export function setMenuEvents() {
    const mainWindow = getMainWindow();

    const cacheStore = useCacheStore();
    const { region } = storeToRefs(cacheStore);

    AppConfig.setGameRegion(cacheStore).catch(MainProcessError.catch);

    ipcMain.on('open-region-select-menu', () => {
        const template: Electron.MenuItemConstructorOptions[] = [
            { label: 'tribalwars.com.br', type: 'radio', click: () => void setGameRegion('br', region) }
        ];

        if (app.getVersion().includes('alpha')) {
            template.push(
                { label: 'tribalwars.com.pt', type: 'radio', click: () => void setGameRegion('pt', region) },
                { label: 'tribalwars.co.uk', type: 'radio', click: () => void setGameRegion('uk', region) },
                { label: 'tribalwars.net', type: 'radio', click: () => void setGameRegion('en', region) },
                { label: 'tribalwars.nl', type: 'radio', click: () => void setGameRegion('nl', region) },
                { label: 'tribalwars.us', type: 'radio', click: () => void setGameRegion('us', region) }
            );
        };

        setCheckedGameRegion(template, region.value);
        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: mainWindow });
    });

    ipcMain.on('open-bug-report-menu', () => {
        const template: Electron.MenuItemConstructorOptions[] = [
            { label: 'Registro de erros', click: () => showErrorLog() },
            { label: 'Problemas conhecidos', click: () => openIssuesWebsite() }
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: mainWindow });
    });
};

function setCheckedGameRegion(template: Electron.MenuItemConstructorOptions[], region: GameRegion) {
    template.forEach((item) => {
        if (item.label?.endsWith(region) || (region === 'en' && item.label?.endsWith('net'))) {
            item.checked = true;
        };
    });
};

async function setGameRegion(region: GameRegion, cachedRegion: MechanusRef<GameRegion>) {
    try {
        if (region !== 'br') {
            const { response } = await dialog.showMessageBox({
                type: 'warning',
                title: 'Not supported',
                noLink: true,
                message: 'This region is currently not supported and is only available as an experimental feature. ' +
                'Therefore, it is quite likely that Ares won\'t work properly.',
                buttons: ['Continue', 'Cancel'],
                defaultId: 1,
                cancelId: 1
            });

            if (response === 1) return;
        };

        await AppConfig.saveGameRegion(region);
        cachedRegion.value = region;

        const regionUrl = getGameRegionUrl(region);
        const contents = getMainViewWebContents();
        await contents.loadURL(regionUrl);
    } catch (err) {
        MainProcessError.catch(err);
    };
};