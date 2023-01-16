import { createRouter, createMemoryHistory } from 'vue-router';

export const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/Home.vue')
        },
        {
            path: '/plunder',
            name: 'plunder',
            component: () => import('@/views/Plunder.vue')
        }
    ]
});