import { isArray, isInteger, isString } from '@tb-dev/ts-guard';
import { useAresStore } from '$vue/stores/ares.js';
import type { RouteRecordRaw } from 'vue-router';

// As funções aqui presentes dependem do Vue em algum grau.

/** Calcula distância em campos entre duas coordenadas. */
export function calcDistance(destX: number, destY: number, originX?: number, originY?: number) {
    const aresStore = useAresStore();
    if (!isInteger(originX)) originX = aresStore.currentX;
    if (!isInteger(originY)) originY = aresStore.currentY;

    return Math.sqrt(((destX - originX) ** 2) + ((destY - originY) ** 2));
};

export function getRouteNames(routes: RouteRecordRaw[]) {
    const names: string[] = [];

    for (const route of routes) {
        if (isString(route.name)) {
            names.push(route.name)
        } else if (isArray(route.children)) {
            names.push(...getRouteNames(route.children))
        };
    };

    return names;
};