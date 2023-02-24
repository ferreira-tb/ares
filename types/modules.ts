import type { RouteComponent } from 'vue-router';
import type { BrowserWindowConstructorOptions } from 'electron';

export type ModuleConstructorOptions = Pick<BrowserWindowConstructorOptions,
    | 'width'
    | 'height'
    | 'title'
    | 'minimizable'
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

export type SingleModules = 'default' | 'demolition';
export type NestedModules = 'app-config' | 'error-log';
export type ModuleNames = NestedModules | SingleModules;

export type ErrorModuleRoutes = 'normal-errors' | 'dom-errors' | 'main-process-errors';
export type ConfigModuleRoutes = 'general-config' | 'plunder-config';

export type ModuleRoutes = ModuleNames | ErrorModuleRoutes | ConfigModuleRoutes;