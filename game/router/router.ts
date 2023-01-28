import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import Default from '$/views/Default.vue';
import Plunder from '$/views/Plunder.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'default',
        component: Default
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