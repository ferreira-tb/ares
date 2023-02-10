import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { getRouteNames } from '$vue/helpers.js';
import Default from '$vue/views/Default.vue';
import Plunder from '$browser/views/Plunder.vue';

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

export const routeNames = getRouteNames(routes);