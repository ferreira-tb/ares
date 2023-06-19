import { app, dialog, ipcMain, Menu } from 'electron';
import { MainWindow, StandardWindow, WebsiteWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import { appConfig } from '$electron/stores';
import { MainProcessError } from '$electron/error';
import { StandardWindowName, WebsiteUrl } from '$common/enum';
import { getGameRegionUrl } from '$common/utils';

export function setMenuEvents() {
    const mainWindow = MainWindow.getInstance();

    ipcMain.on('open-region-select-menu', () => {
        const template: Electron.MenuItemConstructorOptions[] = [
            { label: 'tribalwars.com.br', type: 'radio', click: () => void setGameRegion('br') }
        ];

        if (app.getVersion().includes('alpha')) {
            template.push(
                { label: 'tribalwars.com.pt', type: 'radio', click: () => void setGameRegion('pt') },
                { label: 'tribalwars.co.uk', type: 'radio', click: () => void setGameRegion('uk') },
                { label: 'tribalwars.net', type: 'radio', click: () => void setGameRegion('en') },
                { label: 'tribalwars.nl', type: 'radio', click: () => void setGameRegion('nl') },
                { label: 'tribalwars.us', type: 'radio', click: () => void setGameRegion('us') }
            );
        };

        setCheckedGameRegion(template);
        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: mainWindow.browser });
    });

    ipcMain.on('open-bug-report-menu', () => {
        const template: Electron.MenuItemConstructorOptions[] = [
            { label: 'Registro de erros', click: () => void StandardWindow.open(StandardWindowName.ErrorLog) },
            { label: 'Problemas conhecidos', click: () => void WebsiteWindow.open(WebsiteUrl.Issues) }
        ];

        if (appConfig.get('advanced').debug) {
            template.push({ type: 'separator' });
            template.push({ label: 'Depurar', click: () => void StandardWindow.open(StandardWindowName.Debug) });
        };

        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: mainWindow.browser });
    });
};

function setCheckedGameRegion(template: Electron.MenuItemConstructorOptions[]) {
    const region = appConfig.get('general').lastRegion;
    template.forEach((item) => {
        if (item.label?.endsWith(region) || (region === 'en' && item.label?.endsWith('net'))) {
            item.checked = true;
        };
    });
};

async function setGameRegion(region: GameRegion) {
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

        appConfig.set('general', { lastRegion: region });

        const regionUrl = getGameRegionUrl(region);
        await BrowserTab.main.loadURL(regionUrl);
        
    } catch (err) {
        MainProcessError.catch(err);
    };
};