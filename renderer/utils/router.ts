import { isString } from '$common/guards';
import type { RouteRecordRaw } from 'vue-router';

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