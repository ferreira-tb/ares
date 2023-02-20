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
export type ModuleRoutes =
    | ModuleNames
    | 'default'
    
    | 'general-config'
    | 'plunder-config'

    | 'normal-errors'
    | 'dom-errors'
    | 'main-process-errors';