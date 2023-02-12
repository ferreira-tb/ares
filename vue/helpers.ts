import { useAresStore } from '$vue/stores/store.js';
import type { RouteRecordRaw } from 'vue-router';

// As funções aqui presentes dependem do Vue em algum grau.

/** Calcula distância em campos entre duas coordenadas. */
export function calcDistance(destX: number, destY: number, originX?: number, originY?: number) {
    const aresStore = useAresStore();
    if (typeof originX !== 'number') originX = aresStore.currentX;
    if (typeof originY !== 'number') originY = aresStore.currentY;

    return Math.sqrt(((destX - originX) ** 2) + ((destY - originY) ** 2));
};

export function getRouteNames(routes: RouteRecordRaw[]) {
    const names: string[] = [];

    for (const route of routes) {
        if (typeof route.name === 'string') {
            names.push(route.name)
        } else if (Array.isArray(route.children)) {
            names.push(...getRouteNames(route.children))
        };
    };

    return names;
};