import type { RouteComponent } from 'vue-router';
import type { BrowserWindowConstructorOptions } from 'electron';

export type ModuleConstructorOptions = Pick<
    BrowserWindowConstructorOptions,
    'width' | 'height' | 'title'
>;

export interface ModuleRouteToPush {
    name: ModuleRoutes;
}

export interface ModuleRouteRecordRaw extends ModuleRouteToPush {
    path: string;
    component: RouteComponent;
    children?: ModuleRouteRecordRaw[];
};

export type ModuleNames = 'app-config' | 'error-log';
export type ErrorModuleRoutes = 'normal-errors' | 'dom-errors' | 'main-process-errors';
export type ConfigModuleRoutes = 'general-config' | 'plunder-config';

export type ModuleRoutes = 'default' | ModuleNames | ErrorModuleRoutes | ConfigModuleRoutes;