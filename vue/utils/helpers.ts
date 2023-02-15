import { isArray, isString } from '@tb-dev/ts-guard';
import type { RouteRecordRaw } from 'vue-router';

// As funções aqui presentes dependem do Vue em algum grau.

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