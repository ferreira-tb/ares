import type { RouteComponent } from 'vue-router';
import type { BrowserWindowConstructorOptions } from 'electron';

export type ModuleConstructorOptions = Pick<BrowserWindowConstructorOptions,
    | 'width'
    | 'height'
    | 'title'
    | 'minimizable'
    | 'maximizable'
    | 'resizable'
>;

export interface ModuleRouteToPush {
    name: ModuleRoutes;
}

export interface ModuleRouteRecordRaw extends ModuleRouteToPush {
    path: string;
    component: RouteComponent;
    children?: ModuleRouteRecordRaw[];
};

export type ModuleRouteRecordRawStrict<T> = Omit<ModuleRouteRecordRaw, 'name' | 'children'> & {
    name: T;
    children?: ModuleRouteRecordRawStrict<T>[];
};

export type SingleModules = 'default' | 'demolition' | 'plunder-template';
export type NestedModules = 'app-config' | 'error-log';
export type ModuleNames = NestedModules | SingleModules;

export type ErrorModuleRoutes = 'error-general' | 'error-electron';

export type ConfigModuleRoutes =
    | 'config-advanced'
    | 'config-general'
    | 'config-notifications'
    | 'config-plunder';

export type ModuleRoutes = ModuleNames | ErrorModuleRoutes | ConfigModuleRoutes;


////// WEBSITE
export type WebsiteModuleNames = 'ares' | 'repo' | 'issues';