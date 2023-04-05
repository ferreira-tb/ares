import { ipcRenderer } from 'electron';
import { assertArrayIncludes } from '@tb-dev/ts-guard';
import { routeNames, router } from '$modules/router'; 
import { ModuleRouterError } from '$modules/error';
import type { ModuleRouteToPush } from '$types/modules';

export function setModuleEvents() {
    ipcRenderer.once('set-module-route', async (_e, routeName: string) => {
        try {
            assertArrayIncludes(routeNames, routeName, `${routeName} is not a valid route name.`);
            await router.push({ name: routeName } satisfies ModuleRouteToPush);
        } catch (err) {
            ModuleRouterError.catch(err);
        };
    });
};