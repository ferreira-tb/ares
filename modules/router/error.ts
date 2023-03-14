import ErrorLog from '$modules/views/ErrorLog.vue';
import ErrorList from '$modules/components/error/ErrorList.vue';
import DomErrorList from '$modules/components/error/DomErrorList.vue';
import MainErrorList from '$modules/components/error/MainErrorList.vue';
import type { ModuleRouteRecordRawStrict, ErrorModuleRoutes } from '$types/modules';

export const errorRoutes: ModuleRouteRecordRawStrict<'error-log' | ErrorModuleRoutes> = {
    path: '/error-log',
    name: 'error-log',
    component: ErrorLog,
    children: [
        {
            path: 'normal',
            name: 'normal-errors',
            component: ErrorList
        },
        {
            path: 'dom',
            name: 'dom-errors',
            component: DomErrorList
        },
        {
            path: 'main-process',
            name: 'main-process-errors',
            component: MainErrorList
        }
    ]
};