import type { MenuOption } from 'naive-ui';
import type { RouteRecordRaw } from 'vue-router';

export function getRouteNames<T extends string>(routes: RouteRecordRaw[]): T[] {
    const names: string[] = [];

    for (const route of routes) {
        if (typeof route.name === 'string' && route.name.length > 0) {
            names.push(route.name);
        }
        
        if (Array.isArray(route.children)) {
            names.push(...getRouteNames(route.children));
        }
    }

    return names as T[];
}

/** Verifica se determinada rota está presente no menu. */
export function isMenuRoute(routeName: string, options: MenuOption[]): boolean {
    return options.some((o) => {
        if (o.key === routeName) {
            return true;
        } else if (Array.isArray(o.children)) {
            return isMenuRoute(routeName, o.children);
        }

        return false;
    });
}