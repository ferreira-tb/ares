import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { getRouteNames } from '$vue/utils/helpers';
import Home from '$panel/views/Home.vue';
import Captcha from '$panel/views/Captcha.vue';
import Plunder from '$panel/views/Plunder.vue';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/captcha',
        name: 'captcha',
        component: Captcha
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