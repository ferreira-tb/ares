import { ipcRenderer } from 'electron';
import { assertArrayIncludes } from '@tb-dev/ts-guard';
import { routeNames, router } from '$modules/router/router';
import type { ModuleRouteToPush } from '$types/modules';

export function setModuleEvents() {
    ipcRenderer.once('set-module-route', (_e, routeName: string) => {
        assertArrayIncludes(routeNames, routeName, 'A rota é inválida.');
        router.push({ name: routeName } satisfies ModuleRouteToPush);
    });
};