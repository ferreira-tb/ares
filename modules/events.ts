import { ipcRenderer } from 'electron';
import { routeNames, router } from '$modules/router'; 
import { ModuleRouterError } from '$modules/error';
import type { ModuleRoutes } from '$types/modules';

export function setModuleEvents() {
    ipcRenderer.once('set-module-route', async (_e, name: ModuleRoutes) => {
        try {
            if (!routeNames.includes(name)) {
                throw new ModuleRouterError(`${name} is not a valid route name.`);
            };
            await router.push({ name });
        } catch (err) {
            ModuleRouterError.catch(err);
        };
    });
};