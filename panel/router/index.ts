import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { getRouteNames } from '$global/utils/router';
import HomeView from '$panel/views/HomeView.vue';
import CaptchaView from '$panel/views/CaptchaView.vue';
import PlunderView from '$panel/views/PlunderView.vue';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/captcha',
        name: 'captcha',
        component: CaptchaView
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