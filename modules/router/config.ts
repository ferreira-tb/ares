import Config from '$modules/views/Config.vue';
import ConfigGeneral from '$modules/components/config/ConfigGeneral.vue';
import ConfigPlunder from '$modules/components/config/ConfigPlunder.vue';
import type { ModuleRouteRecordRawStrict, ConfigModuleRoutes } from '$types/modules';

export const configRoutes: ModuleRouteRecordRawStrict<'app-config' | ConfigModuleRoutes> = {
    path: '/app-config',
    name: 'app-config',
    component: Config,
    children: [
        {
            path: 'general',
            name: 'general-config',
            component: ConfigGeneral
        },
        {
            path: 'plunder',
            name: 'plunder-config',
            component: ConfigPlunder
        }
    ]
};