import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import ErrorLog from '../views/ErrorLog.vue';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const routes: RouteRecordRaw[] = [
    {
        path: '/error-log',
        name: 'error-log',
        component: ErrorLog
    }
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes: routes
});

export const routeNames = routes.map((route) => route.name as string);