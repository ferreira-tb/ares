import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { getRouteNames } from '$vue/helpers.js';
import Default from '$vue/views/Default.vue';
import ErrorLog from '../views/ErrorLog.vue';
import ErrorList from '../components/ErrorList.vue';
import DomErrorList from '../components/DomErrorList.vue';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'default',
        component: Default
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
            }
        ]
    }
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes: routes
});

export const routeNames = getRouteNames(routes);