import ConfigView from '$modules/views/ConfigView.vue';
import ConfigGeneral from '$modules/components/ConfigGeneral.vue';
import ConfigPlunder from '$modules/components/ConfigPlunder.vue';
import type { ModuleRouteRecordRawStrict, ConfigModuleRoutes } from '$types/modules';

export const configRoutes: ModuleRouteRecordRawStrict<'app-config' | ConfigModuleRoutes> = {
    path: '/app-config',
    name: 'app-config',
    component: ConfigView,
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