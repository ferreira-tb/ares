import { ipcRenderer } from 'electron';
import { routeNames, router } from '$modules/router/router.js';
import { assertArrayIncludes } from '@tb-dev/ts-guard';
import type { ModuleRouteToPush } from '$types/modules.js';

export function setModuleEvents() {
    ipcRenderer.once('set-module-route', (_e, routeName: string) => {
        assertArrayIncludes(routeNames, routeName, 'A rota é inválida.');
        router.push({ name: routeName } satisfies ModuleRouteToPush);
    });
};