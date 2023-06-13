import ConfigView from '$windows/views/ConfigView.vue';
import ConfigAdvanced from '$windows/components/ConfigAdvanced.vue';
import ConfigBuildingsSnob from '$windows/components/ConfigBuildingsSnob.vue';
import ConfigGeneral from '$windows/components/ConfigGeneral.vue';
import ConfigNotifications from '$windows/components/ConfigNotifications.vue';
import ConfigPlunder from '$windows/components/ConfigPlunder.vue';

export const configRoutes: ModuleRouteRecordRawStrict<ConfigModuleRoutes | 'app-config'> = {
    path: '/app-config',
    name: 'app-config',
    component: ConfigView,
    children: [
        {
            path: 'general',
            name: 'config-general',
            component: ConfigGeneral
        },
        {
            path: 'buildings-snob',
            name: 'config-buildings-snob',
            component: ConfigBuildingsSnob
        },
        {
            path: 'plunder',
            name: 'config-plunder',
            component: ConfigPlunder
        },
        {
            path: 'notifications',
            name: 'config-notifications',
            component: ConfigNotifications
        },
        {
            path: 'advanced',
            name: 'config-advanced',
            component: ConfigAdvanced
        }
    ]
};