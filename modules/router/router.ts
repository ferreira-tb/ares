import { createRouter, createMemoryHistory } from 'vue-router';
import { getRouteNames, getChildrenRoutes } from '$global/utils/router';
import { errorRoutes } from '$modules/router/error';
import { configRoutes } from '$modules/router/config';
import Default from '$global/views/Default.vue';
import Demolition from '$modules/views/Demolition.vue';
import CustomTemplate from '$modules/views/CustomTemplate.vue';
import type { ModuleRouteRecordRaw, ModuleRoutes, ConfigModuleRoutes } from '$types/modules';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const singleRoutes: ModuleRouteRecordRaw[] = [
    {
        path: '/',
        name: 'default',
        component: Default
    },
    {
        path: '/demolition',
        name: 'demolition',
        component: Demolition
    },
    {
        path: '/custom-plunder-template',
        name: 'custom-plunder-template',
        component: CustomTemplate
    }
];

const routes: ModuleRouteRecordRaw[] = [
    ...singleRoutes,
    configRoutes,
    errorRoutes
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes: routes
});

export const routeNames = getRouteNames<ModuleRoutes>(routes);
export const configRouteNames = getChildrenRoutes<ConfigModuleRoutes>(routes, 'app-config');