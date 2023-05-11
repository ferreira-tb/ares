type AppConfigName =
    'app_state' | 'app_update' | 'config_general' | 'config_notifications' | 'panel_bounds';

type AppConfigJSON =
    AppStateType | GeneralConfigType | NotificationsConfigType | PanelBoundsConfigType | UpdateConfigType;

type AppConfigByName<T extends AppConfigName> =
    T extends 'config_general' ? GeneralConfigType :
    T extends 'config_notifications' ? NotificationsConfigType :
    never;

type AppStateType = {
    /** Última região acessada pelo usuário. */
    lastRegion?: GameRegion;
};

type UpdateConfigType = {
    /** O Ares alertará o usuário apenas quando houver uma versão mais recente que a ignorada. */
    versionToIgnore: string;
};

type GeneralConfigType = {
    /** Indica se a view deve ser atualizada após remoção de captchas. */
    reloadAfterCaptcha: boolean;
};

type NotificationsConfigType = {
    /** Indica se o usuário deve ser notificado quando ocorrer um erro. */
    notifyOnError: boolean;
};

type PanelBoundsConfigType = Electron.Rectangle;