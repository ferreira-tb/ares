import { createRouter, createMemoryHistory } from 'vue-router';
import { getRouteNames, getChildrenRoutes } from '$global/utils/router';
import { errorRoutes } from '$modules/router/error';
import { configRoutes } from '$modules/router/config';
import DefaultView from '$global/views/DefaultView.vue';
import DemolitionView from '$modules/views/DemolitionView.vue';
import PlunderTemplateView from '$modules/views/PlunderTemplateView.vue';
import type { ModuleRouteRecordRaw, ModuleRoutes, ConfigModuleRoutes } from '$types/modules';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const singleRoutes: ModuleRouteRecordRaw[] = [
    {
        path: '/',
        name: 'default',
        component: DefaultView
    },
    {
        path: '/demolition',
        name: 'demolition',
        component: DemolitionView
    },
    {
        path: '/plunder-template',
        name: 'plunder-template',
        component: PlunderTemplateView
    }
];

const routes: ModuleRouteRecordRaw[] = [
    ...singleRoutes,
    configRoutes,
    errorRoutes
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes
});

export const routeNames = getRouteNames<ModuleRoutes>(routes);
export const configRouteNames = getChildrenRoutes<ConfigModuleRoutes>(routes, 'app-config');