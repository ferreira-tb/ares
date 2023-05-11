import ConfigView from '$modules/views/ConfigView.vue';
import ConfigAdvanced from '$modules/components/ConfigAdvanced.vue';
import ConfigGeneral from '$modules/components/ConfigGeneral.vue';
import ConfigNotifications from '$modules/components/ConfigNotifications.vue';
import ConfigPlunder from '$modules/components/ConfigPlunder.vue';

export const configRoutes: ModuleRouteRecordRawStrict<ConfigModuleRoutes | 'app-config'> = {
    path: '/app-config',
    name: 'app-config',
    component: ConfigView,
    children: [
        {
            path: 'advanced',
            name: 'config-advanced',
            component: ConfigAdvanced
        },
        {
            path: 'general',
            name: 'config-general',
            component: ConfigGeneral
        },
        {
            path: 'notifications',
            name: 'config-notifications',
            component: ConfigNotifications
        },
        {
            path: 'plunder',
            name: 'config-plunder',
            component: ConfigPlunder
        }
    ]
};