type ModuleConstructorOptions = Pick<Electron.BrowserWindowConstructorOptions,
    'height' | 'maximizable' | 'minHeight' | 'minimizable' | 'minWidth' | 'resizable' | 'title' | 'width'
>;

interface ModuleRouteToPush {
    name: ModuleRoutes;
}

interface ModuleRouteRecordRaw extends ModuleRouteToPush {
    path: string;
    component: import('vue-router').RouteComponent;
    children?: ModuleRouteRecordRaw[];
};

type ModuleRouteRecordRawStrict<T> = Omit<ModuleRouteRecordRaw, 'children' | 'name'> & {
    name: T;
    children?: ModuleRouteRecordRawStrict<T>[];
};

type SingleModules =
    'app-update' | 'default' | 'demolition' | 'plunder-history' | 'plunder-template';

type NestedModules = 'app-config' | 'error-log';
type ModuleNames = NestedModules | SingleModules;

type ConfigModuleRoutes =
    'config-advanced' | 'config-general' | 'config-notifications' | 'config-plunder';

type ModuleRoutes = ConfigModuleRoutes | ModuleNames;

// WEBSITE
type WebsiteModuleNames = 'any-allowed' | 'ares' | 'issues' | 'repo';