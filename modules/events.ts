import { ipcRenderer } from 'electron';
import { routeNames, router } from './router/router.js';
import { assertArrayIncludes } from '$global/error.js';

export function setModuleEvents() {
    ipcRenderer.once('set-module-route', (_e, routeName: string) => {
        assertArrayIncludes(routeNames, routeName, 'A rota é inválida.');
        router.push({ name: routeName });
    });
};