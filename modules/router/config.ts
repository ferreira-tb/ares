import Config from '$modules/views/Config.vue';
import GeneralConfig from '$modules/components/config/GeneralConfig.vue';
import PlunderConfig from '$modules/components/config/PlunderConfig.vue';
import type { ModuleRouteRecordRawStrict, ConfigModuleRoutes } from '$types/modules.js';

export const configRoutes: ModuleRouteRecordRawStrict<'app-config' | ConfigModuleRoutes> = {
    path: '/app-config',
    name: 'app-config',
    component: Config,
    children: [
        {
            path: 'general',
            name: 'general-config',
            component: GeneralConfig
        },
        {
            path: 'plunder',
            name: 'plunder-config',
            component: PlunderConfig
        }
    ]
};