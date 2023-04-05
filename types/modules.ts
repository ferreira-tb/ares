import type { RouteComponent } from 'vue-router';
import type { BrowserWindowConstructorOptions } from 'electron';

export type ModuleConstructorOptions = Pick<BrowserWindowConstructorOptions,
    'height' | 'maximizable' | 'minimizable' | 'resizable' | 'title' | 'width'
>;

export interface ModuleRouteToPush {
    name: ModuleRoutes;
}

export interface ModuleRouteRecordRaw extends ModuleRouteToPush {
    path: string;
    component: RouteComponent;
    children?: ModuleRouteRecordRaw[];
};

export type ModuleRouteRecordRawStrict<T> = Omit<ModuleRouteRecordRaw, 'children' | 'name'> & {
    name: T;
    children?: ModuleRouteRecordRawStrict<T>[];
};

export type SingleModules = 'app-update' | 'default' | 'demolition' | 'plunder-template';
export type NestedModules = 'app-config' | 'error-log';
export type ModuleNames = NestedModules | SingleModules;

export type ErrorModuleRoutes = 'error-electron' | 'error-general';

export type ConfigModuleRoutes =
    | 'config-advanced'
    | 'config-general'
    | 'config-notifications'
    | 'config-plunder';

export type ModuleRoutes = ConfigModuleRoutes | ErrorModuleRoutes | ModuleNames;


// WEBSITE
export type WebsiteModuleNames = 'any-allowed' | 'ares' | 'issues' | 'repo';