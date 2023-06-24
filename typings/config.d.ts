type AdvancedConfigType = {
    /** Habilita o modo de depuração. */
    debug: boolean;
    /** Habilita o DevTools. */
    devTools: boolean;
};

type GeneralConfigType = {
    /** Última região acessada pelo usuário. */
    lastRegion: GameRegion;
    /** Indica se a view deve ser atualizada após remoção de captchas. */
    reloadAfterCaptcha: boolean;
};

type WindowBoundsConfigType = {
    [name in import('$common/enum').StandardWindowName]?: {
        /** Posição e tamanho do módulo. */
        bounds: Electron.Rectangle | null;
    };
};

type NotificationsConfigType = {
    /** Indica se o usuário deve ser notificado quando ocorrer um erro. */
    notifyOnError: boolean;
};

type TagsConfigType = {
    nextIncoming: boolean;
    plunder: boolean;
    responseTime: boolean;
    snob: boolean;
};

type UIConfigType = {
    /** Posição e tamanho da janela principal. */
    bounds: Electron.Rectangle | null;
};

type UpdateConfigType = {
    /** O Ares alertará o usuário apenas quando houver uma versão mais recente que a ignorada. */
    versionToIgnore: string | null;
};

type AppConfigType = {
    /** Configurações avançadas. */
    advanced: AdvancedConfigType;
    /** Configurações gerais. */
    general: GeneralConfigType;
    /** Configurações de notificações. */
    notifications: NotificationsConfigType;
    /** Configurações das etiquetas da interface do usuário. */
    tags: TagsConfigType;
    /** Configurações da interface do usuário. */
    ui: UIConfigType;
    /** Configurações de atualização. */
    update: UpdateConfigType;
    /** Configurações das dimensões das janelas secundárias. */
    window: WindowBoundsConfigType;
};