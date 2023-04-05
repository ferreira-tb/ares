import { ipcMain } from 'electron';
import { showErrorLog } from '$electron/app/modules';
import { setDemolitionModuleEvents } from '$electron/events/modules/demolition';
import { setPlunderTemplatesModuleEvents } from '$electron/events/modules/templates';
import { setAppUpdateModuleEvents } from '$electron/events/modules/update';

export function setModuleEvents() {
    ipcMain.on('open-error-log-window', () => showErrorLog());

    setAppUpdateModuleEvents();
    setDemolitionModuleEvents();
    setPlunderTemplatesModuleEvents();
};