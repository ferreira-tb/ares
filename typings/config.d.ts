type AppCacheType = {
    /** Última região acessada pelo usuário. */
    lastRegion: GameRegion;
};

type GeneralConfigType = {
    /** Indica se a view deve ser atualizada após remoção de captchas. */
    reloadAfterCaptcha: boolean;
};

type NotificationsConfigType = {
    /** Indica se o usuário deve ser notificado quando ocorrer um erro. */
    notifyOnError: boolean;
};

type PanelConfigType = {
    /** Indica se o painel deve ser exibido. */
    show: boolean;
    /** Posição e tamanho do painel. */
    bounds: Electron.Rectangle | null;
};

type UIConfigType = {
    /** Posição e tamanho da janela principal. */
    bounds: Electron.Rectangle | null;
};

type UpdateConfigType = {
    /** O Ares alertará o usuário apenas quando houver uma versão mais recente que a ignorada. */
    versionToIgnore: string | null;
};

interface AppConfigType {
    /** Configurações de cache. */
    cache: AppCacheType;
    /** Configurações gerais. */
    general: GeneralConfigType;
    /** Configurações de notificações. */
    notifications: NotificationsConfigType;
    /** Configurações do painel. */
    panel: PanelConfigType;
    /** Configurações da interface do usuário. */
    ui: UIConfigType;
    /** Configurações de atualização. */
    update: UpdateConfigType;
};