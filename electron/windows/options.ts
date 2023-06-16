import { StandardWindowName } from '$common/constants';

const configOptions: BrowserWindowOptions = {
    width: 700,
    height: 600,
    title: 'Configurações'
};

export const windowOptions: { [key in StandardWindowName]: BrowserWindowOptions } = {
    [StandardWindowName.Config]: configOptions,
    [StandardWindowName.ConfigAdvanced]: configOptions,
    [StandardWindowName.ConfigBuildingsSnob]: configOptions,
    [StandardWindowName.ConfigGeneral]: configOptions,
    [StandardWindowName.ConfigNotifications]: configOptions,
    [StandardWindowName.ConfigPlunder]: configOptions,
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
        title: 'Registro de Erros'
    },
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
    [StandardWindowName.Update]: {
        width: 350,
        height: 260,
        title: 'Atualização'
    }
};