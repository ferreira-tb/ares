import { createRouter, createMemoryHistory } from 'vue-router';
import { getRouteNames, getChildrenRoutes } from '$renderer/utils/router';
import { configRoutes } from '$modules/router/config';
import AppUpdateView from '$modules/views/AppUpdateView.vue';
import DebugView from '$modules/views/DebugView.vue';
import DefaultView from '$renderer/views/DefaultView.vue';
import DemolitionView from '$modules/views/DemolitionView.vue';
import ErrorLogView from '$modules/views/ErrorLogView.vue';
import PlunderHistoryView from '$modules/views/PlunderHistoryView.vue';
import PlunderTemplateView from '$modules/views/PlunderTemplateView.vue';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const singleRoutes: ModuleRouteRecordRaw[] = [
    {
        path: '/',
        name: 'default',
        component: DefaultView
    },
    {
        path: '/app-update',
        name: 'app-update',
        component: AppUpdateView
    },
    {
        path: '/debug',
        name: 'debug',
        component: DebugView
    },
    {
        path: '/demolition',
        name: 'demolition',
        component: DemolitionView
    },
    {
        path: '/error-log',
        name: 'error-log',
        component: ErrorLogView
    },
    {
        path: '/plunder-history',
        name: 'plunder-history',
        component: PlunderHistoryView
    },
    {
        path: '/plunder-template',
        name: 'plunder-template',
        component: PlunderTemplateView
    }
];

const routes: ModuleRouteRecordRaw[] = [...singleRoutes, configRoutes];

export const router = createRouter({
    history: createMemoryHistory(),
    routes
});

export const routeNames = getRouteNames<ModuleRoutes>(routes);
export const configRouteNames = getChildrenRoutes<ConfigModuleRoutes>(routes, 'app-config');