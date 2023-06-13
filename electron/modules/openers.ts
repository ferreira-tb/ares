import { WebsiteUrl } from '$common/constants';
import { createModule } from '$electron/modules/standard';
import { createWebsiteModule } from '$electron/modules/website';

// Padrão
export const showAppSettings = createModule('app-config', 'app-config', {
    width: 700,
    height: 600,
    title: 'Configurações'
});

export const showAppUpdate = createModule('app-update', 'app-update', {
    width: 350,
    height: 260,
    title: 'Atualização'
});

export const showDebug = createModule('debug', 'debug', {
    width: 1000,
    height: 600,
    title: 'Modo de depuração',
    minimizable: true,
    maximizable: true,
    resizable: true
});

export const showDemolitionConfig = createModule('demolition', 'demolition', {
    width: 1000,
    height: 600,
    title: 'Demolição',
    minimizable: true
});

export const showErrorLog = createModule('error-log', 'error-log', {
    width: 500,
    height: 600,
    title: 'Registro de Erros'
});

export const showPlunderHistory = createModule('plunder-history', 'plunder-history', {
    width: 1200,
    minWidth: 1200,
    height: 800,
    minHeight: 800,
    title: 'Histórico de saque',
    minimizable: true,
    maximizable: true,
    resizable: true
});

export const showCustomPlunderTemplate = createModule('plunder-template', 'plunder-template', {
    width: 1000,
    height: 600,
    title: 'Modelos',
    minimizable: true
});

// Websites
export const openAnyAllowedWebsite = createWebsiteModule('any-allowed', '');
export const openAresWebsite = createWebsiteModule('ares', WebsiteUrl.Ares);
export const openRepoWebsite = createWebsiteModule('repo', WebsiteUrl.Repository);
export const openIssuesWebsite = createWebsiteModule('issues', WebsiteUrl.Issues);