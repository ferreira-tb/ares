import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { ipcMain, Menu, webContents } from 'electron';
import { appConfig } from '$electron/stores';
import { MainWindow, StandardWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import { TribalWorker } from '$electron/worker';
import { MainProcessError } from '$electron/error';
import { StandardWindowName } from '$common/enum';

export function setDebugEvents() {
    ipcMain.handle('debug:is-enabled', () => appConfig.get('advanced').debug);

    ipcMain.on('debug:toggle', (e, value: boolean) => {
        for (const contents of webContents.getAllWebContents()) {
            if (contents === e.sender) continue;
            contents.send('debug:did-update-status', value);
        }
    });

    const sender = getSenderName();
    ipcMain.on('debug:report', (e, processType: 'main' | 'renderer', channel: string, ...args: unknown[]) => {
        const debugWindow = StandardWindow.getWindow(StandardWindowName.Debug);
        if (!debugWindow || channel.startsWith('debug')) return;

        const data = args.map((arg) => {
            if (arg instanceof Set || arg instanceof Map) {
                return Array.from<unknown>(arg);
            }

            return arg;
        });

        const debufInfo: AppDebugInfo = {
            uuid: randomUUID(),
            channel,
            from: processType === 'main' ? 'ELECTRON' : sender(e.sender),
            to: processType === 'main' ? sender(e.sender) : 'ELECTRON',
            time: performance.now(),
            data
        };

        debugWindow.webContents.send('debug:did-receive-report', debufInfo);
    });

    ipcMain.on('debug:show-context-menu', (e, isOptionsVisible: boolean) => {
        const optionsLabel = isOptionsVisible ? 'Ocultar opções' : 'Mostrar opções';
        const template: Electron.MenuItemConstructorOptions[] = [
            { label: optionsLabel, click: () => e.sender.send('debug:toggle-options') },
            { label: 'Limpar', click: () => e.sender.send('debug:clear') }
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup();
    });
}

function getSenderName() {
    const mainWindow = MainWindow.getInstance();
    const mainView = BrowserTab.main;

    return function(sender: Electron.WebContents): string {
        try {
            if (sender === mainWindow.webContents) return 'UI';
            if (sender === mainView.webContents) return 'BROWSER';

            const standardWindow = StandardWindow.getWindow(sender);
            if (standardWindow) return standardWindow.name.replaceAll('-', ' ').toUpperCase();

            const worker = TribalWorker.getWorker(sender);
            if (worker) return worker.name.replaceAll('-', ' ').toUpperCase();

        } catch (err) {
            MainProcessError.catch(err);
        }

        return sender.id.toString(10);
    };
}