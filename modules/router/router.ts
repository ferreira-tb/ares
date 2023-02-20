import { createRouter, createMemoryHistory } from 'vue-router';
import { getRouteNames } from '$vue/utils/helpers.js';
import Default from '$vue/views/Default.vue';

import Config from '$modules/views/Config.vue';
import GeneralConfig from '$modules/components/config/GeneralConfig.vue';
import PlunderConfig from '$modules/components/config/PlunderConfig.vue';

import ErrorLog from '$modules/views/ErrorLog.vue';
import ErrorList from '$modules/components/error/ErrorList.vue';
import DomErrorList from '$modules/components/error/DomErrorList.vue';
import MainErrorList from '$modules/components/error/MainErrorList.vue';

import type { ModuleRouteRecordRaw, ModuleRoutes } from '$types/modules.js';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const routes: ModuleRouteRecordRaw[] = [
    {
        path: '/',
        name: 'default',
        component: Default
    },
    {
        path: '/app-config',
        name: 'app-config',
        component: Config,
        children: [
            {
                path: 'general',
                name: 'general-config',
                component: GeneralConfig
            },
            {
                path: 'plunder',
                name: 'plunder-config',
                component: PlunderConfig
            }
        ]
    },
    {
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
    }
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes: routes
});

export const routeNames = getRouteNames(routes) as ModuleRoutes[];