import ErrorLogView from '$modules/views/ErrorLogView.vue';
import ErrorLogGeneral from '$modules/components/ErrorLogGeneral.vue';
import ErrorLogDom from '$modules/components/ErrorLogDom.vue';
import ErrorLogElectron from '$modules/components/ErrorLogElectron.vue';
import type { ModuleRouteRecordRawStrict, ErrorModuleRoutes } from '$types/modules';

export const errorRoutes: ModuleRouteRecordRawStrict<'error-log' | ErrorModuleRoutes> = {
    path: '/error-log',
    name: 'error-log',
    component: ErrorLogView,
    children: [
        {
            path: 'normal',
            name: 'normal-errors',
            component: ErrorLogGeneral
        },
        {
            path: 'dom',
            name: 'dom-errors',
            component: ErrorLogDom
        },
        {
            path: 'main-process',
            name: 'main-process-errors',
            component: ErrorLogElectron
        }
    ]
};