import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { getRouteNames } from '$global/utils/router';
import DefaultView from '$global/views/DefaultView.vue';
import PlunderView from '$browser/views/PlunderView.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'default',
        component: DefaultView
    },
    {
        path: '/am_farm',
        name: 'am_farm',
        component: PlunderView
    }
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes
});

export const routeNames = getRouteNames(routes);