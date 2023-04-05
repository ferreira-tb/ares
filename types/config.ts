import type { Rectangle } from 'electron';

export type AppConfigName =
    | 'app_update'
    | 'config_general'
    | 'config_notifications'
    | 'panel_bounds';

export type AppConfigJSON =
    AppNotificationsConfigType | AppUpdateConfigType | GeneralAppConfigType | PanelBoundsConfigType;

export type AppConfigByName<T extends AppConfigName> =
    T extends 'config_general' ? GeneralAppConfigType :
    T extends 'config_notifications' ? AppNotificationsConfigType :
    never;

export type PanelBoundsConfigType = Rectangle;

export type GeneralAppConfigType = {
    /** Indica se a view deve ser atualizada após remoção de captchas. */
    reloadAfterCaptcha: boolean;
};

export type AppNotificationsConfigType = {
    /** Indica se o usuário deve ser notificado quando ocorrer um erro. */
    notifyOnError: boolean;
};

export type AppUpdateConfigType = {
    /** O Ares alertará o usuário apenas quando houver uma versão mais recente que a ignorada. */
    versionToIgnore: string;
};