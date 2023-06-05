import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { getRouteNames } from '$renderer/utils/router';
import HomeView from '$panel/views/HomeView.vue';
import PlunderView from '$panel/views/PlunderView.vue';
import SnobView from '$panel/views/SnobView.vue';

// Os componentes devem ser passados diretamente.
// Importá-los gera problemas ao compilar.

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/am_farm',
        name: 'am_farm',
        component: PlunderView
    },
    {
        path: '/snob',
        name: 'snob',
        component: SnobView
    }
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes
});

export const routeNames = getRouteNames(routes);