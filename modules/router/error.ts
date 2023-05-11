import ErrorLogView from '$modules/views/ErrorLogView.vue';
import ErrorLogGeneral from '$modules/components/ErrorLogGeneral.vue';
import ErrorLogElectron from '$modules/components/ErrorLogElectron.vue';

export const errorRoutes: ModuleRouteRecordRawStrict<ErrorModuleRoutes | 'error-log'> = {
    path: '/error-log',
    name: 'error-log',
    component: ErrorLogView,
    children: [
        {
            path: 'normal',
            name: 'error-general',
            component: ErrorLogGeneral
        },
        {
            path: 'electron',
            name: 'error-electron',
            component: ErrorLogElectron
        }
    ]
};