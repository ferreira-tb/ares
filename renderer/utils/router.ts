import type { MenuOption } from 'naive-ui';

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