import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { ipcMain, Menu, webContents } from 'electron';
import { appConfig } from '$electron/stores';
import { getActiveModuleWebContents } from '$electron/modules';
import { getMainWindow, getPanelWindow } from '$electron/utils/helpers';
import { getMainViewWebContents } from '$electron/utils/view';
import { getModuleNameByWebContentsId } from '$electron/modules';
import { TribalWorker } from '$electron/worker';
import { MainProcessEventError } from '$electron/error';

export function setDebugEvents() {
    ipcMain.handle('debug:is-enabled', () => appConfig.get('advanced').debug);

    ipcMain.on('debug:toggle', (e, value: boolean) => {
        for (const contents of webContents.getAllWebContents()) {
            if (contents === e.sender) continue;
            contents.send('debug:did-update-status', value);
        };
    });

    const sender = getSenderName();
    ipcMain.on('debug:report', (e, processType: 'main' | 'renderer', channel: string, ...args: unknown[]) => {
        const debugModule = getActiveModuleWebContents('debug');
        if (!debugModule || channel.startsWith('debug')) return;

        const data = args.map((arg) => {
            if (arg instanceof Set || arg instanceof Map) {
                return Array.from<unknown>(arg);
            };

            return arg;
        });

        const debufInfo: AppDebugInfo = {
            uuid: randomUUID(),
            channel,
            from: processType === 'main' ? 'ELECTRON' : sender(e.sender.id),
            to: processType === 'main' ? sender(e.sender.id) : 'ELECTRON',
            time: performance.now(),
            data
        };

        debugModule.send('debug:did-receive-report', debufInfo);
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
};

function getSenderName() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();
    const mainView = getMainViewWebContents();

    // TODO: Incluir algo similar no registro de erro.
    return function(senderId: number): string {
        try {
            if (senderId === mainWindow.webContents.id) return 'UI';
            if (senderId === panelWindow.webContents.id) return 'PANEL';
            if (senderId === mainView.id) return 'BROWSER';

            const moduleName = getModuleNameByWebContentsId(senderId);
            if (moduleName) return moduleName.replaceAll('-', ' ').toUpperCase();

            const workerName = TribalWorker.getWorkerNameByWebContentsId(senderId);
            if (workerName) return workerName.replaceAll('-', ' ').toUpperCase();

        } catch (err) {
            MainProcessEventError.catch(err);
        };

        return senderId.toString(10);
    };
};