import { isArray, isString } from '@tb-dev/ts-guard';
import type { RouteRecordRaw } from 'vue-router';

// As funções aqui presentes dependem do Vue em algum grau.

export function getRouteNames<T extends string>(routes: RouteRecordRaw[]): T[] {
    const names: string[] = [];

    for (const route of routes) {
        if (isString(route.name)) {
            names.push(route.name)
        };
        
        if (isArray(route.children)) {
            names.push(...getRouteNames(route.children));
        };
    };

    return names as T[];
};

export function getChildrenRoutes<T extends string>(routes: RouteRecordRaw[]): T[] {
    const children: string[] = [];

    for (const route of routes) {
        if (isArray(route.children)) {
            children.push(...getRouteNames(route.children));
        };
    };

    return children as T[];
};