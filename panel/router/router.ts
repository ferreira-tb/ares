import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Plunder from '@/views/Plunder.vue';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/am_farm',
        name: 'am_farm',
        component: Plunder
    }
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes: routes
});

export const routeNames = routes.map((route) => route.name as string);