import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { getRouteNames } from '$global/utils/router';
import Default from '$global/views/Default.vue';
import PlunderView from '$browser/views/PlunderView.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'default',
        component: Default
    },
    {
        path: '/am_farm',
        name: 'am_farm',
        component: PlunderView
    }
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes: routes
});

export const routeNames = getRouteNames(routes);