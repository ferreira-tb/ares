import type { Rectangle } from 'electron';

export type AppConfigName =
    | 'general_config'
    | 'panel_bounds';

export type AppConfigJSON = GeneralAppConfigType | Rectangle;

export type GeneralAppConfigType = {
    /** Indica se a view deve ser atualizada após remoção de captchas. */
    reloadAfterCaptcha: boolean;
};