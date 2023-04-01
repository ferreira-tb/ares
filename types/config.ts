import type { Rectangle } from 'electron';

export type AppConfigName =
    | 'config_general'
    | 'config_notifications'
    | 'panel_bounds';

export type AppConfigJSON =
    | GeneralAppConfigType
    | AppNotificationsConfigType
    | Rectangle;

export type AppConfigByName<T extends AppConfigName> =
    T extends 'config_general' ? GeneralAppConfigType :
    T extends 'config_notifications' ? AppNotificationsConfigType :
    never;

export type GeneralAppConfigType = {
    /** Indica se a view deve ser atualizada após remoção de captchas. */
    reloadAfterCaptcha: boolean;
};

export type AppNotificationsConfigType = {
    /** Indica se o usuário deve ser notificado quando ocorrer um erro. */
    notifyOnError: boolean;
};