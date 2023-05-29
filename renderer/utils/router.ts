import { isString } from '$shared/guards';
import type { RouteRecordRaw } from 'vue-router';

// As funções aqui presentes dependem do Vue em algum grau.

export function getRouteNames<T extends string>(routes: RouteRecordRaw[]): T[] {
    const names: string[] = [];

    for (const route of routes) {
        if (isString(route.name)) {
            names.push(route.name);
        };
        
        if (Array.isArray(route.children)) {
            names.push(...getRouteNames(route.children));
        };
    };

    return names as T[];
};

/**
 * Obtêm todas as filhas de uma determinada rota.
 * @param routes Array contendo as rotas.
 * @param name Se especificado, obtêm apenas as filhas da rota com o nome indicado.
 */
export function getChildrenRoutes<T extends string>(routes: RouteRecordRaw[], name?: string): T[] {
    const children: string[] = [];

    for (const route of routes) {
        if (Array.isArray(route.children)) {
            if (isString(name) && route.name !== name) continue;
            children.push(...getRouteNames(route.children));
        };
    };

    return children as T[];
};