import type { Rectangle } from 'electron';
import type { GameRegion } from '$types/game';

export type AppConfigName =
    'app_state' | 'app_update' | 'config_general' | 'config_notifications' | 'panel_bounds';

export type AppConfigJSON =
    AppStateType | GeneralConfigType | NotificationsConfigType | PanelBoundsConfigType | UpdateConfigType;

export type AppConfigByName<T extends AppConfigName> =
    T extends 'config_general' ? GeneralConfigType :
    T extends 'config_notifications' ? NotificationsConfigType :
    never;

export type AppStateType = {
    /** Última região acessada pelo usuário. */
    lastRegion?: GameRegion;
};

export type UpdateConfigType = {
    /** O Ares alertará o usuário apenas quando houver uma versão mais recente que a ignorada. */
    versionToIgnore: string;
};

export type GeneralConfigType = {
    /** Indica se a view deve ser atualizada após remoção de captchas. */
    reloadAfterCaptcha: boolean;
};

export type NotificationsConfigType = {
    /** Indica se o usuário deve ser notificado quando ocorrer um erro. */
    notifyOnError: boolean;
};

export type PanelBoundsConfigType = Rectangle;