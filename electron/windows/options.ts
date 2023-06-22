import { StandardWindowName } from '$common/enum';

const config: BrowserWindowOptions = {
    width: 700,
    height: 600,
    title: 'Configurações'
};

const groupTemplate: BrowserWindowOptions = {
    width: 900,
    height: 600,
    title: 'Modelos de grupo'
};

export const windowOptions: { [key in StandardWindowName]: BrowserWindowOptions } = {
    [StandardWindowName.Config]: config,
    [StandardWindowName.ConfigAdvanced]: config,
    [StandardWindowName.ConfigBuildingsSnob]: config,
    [StandardWindowName.ConfigGeneral]: config,
    [StandardWindowName.ConfigNotifications]: config,
    [StandardWindowName.ConfigPlunder]: config,
    [StandardWindowName.Debug]: {
        width: 1000,
        height: 600,
        title: 'Modo de depuração',
        minimizable: true,
        maximizable: true,
        resizable: true
    },
    [StandardWindowName.Default]: {},
    [StandardWindowName.DemolitionTemplate]: {
        width: 1000,
        height: 600,
        title: 'Demolição',
        minimizable: true
    },
    [StandardWindowName.ErrorLog]: {
        width: 500,
        height: 600,
        title: 'Registro de erros'
    },
    [StandardWindowName.GroupTemplate]: groupTemplate,
    [StandardWindowName.GroupTemplateSafeZone]: groupTemplate,
    [StandardWindowName.PlunderHistory]: {
        width: 1200,
        minWidth: 1200,
        height: 800,
        minHeight: 800,
        title: 'Histórico de saque',
        minimizable: true,
        maximizable: true,
        resizable: true
    },
    [StandardWindowName.PlunderTemplate]: {
        width: 1000,
        height: 600,
        title: 'Modelos',
        minimizable: true
    },
    [StandardWindowName.TroopsCounter]: {
        width: 600,
        minWidth: 600,
        maxWidth: 1000,
        height: 400,
        minHeight: 400,
        maxHeight: 400,
        resizable: true,
        title: 'Contador de tropas'
    },
    [StandardWindowName.Update]: {
        width: 350,
        height: 260,
        title: 'Atualização'
    }
};