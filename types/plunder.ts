export type PlunderState = {
    /** Indica se o Ares está ativado. */
    active: boolean;
    /** Determina se o Ares deve atacar aldeias com muralha. */
    ignoreWall: boolean;
    /** Determina se o Ares deve demolir a muralha das aldeias. */
    destroyWall: boolean;
    /** Determina se o Ares deve utilizar o grupo Insidious ao atacar. */
    groupAttack: boolean;
    /** Determina se o Ares deve atacar usando o modelo C. */
    useC: boolean;
    /** Se ativado, o Ares não terá delay entre os ataques. */
    ignoreDelay: boolean;
    /** Se ativado, o Ares não levará em consideração as informações dos exploradores. */
    blindAttack: boolean;

    /** Razão de recursos que o Ares deve levar em consideração. */
    resourceRatio: number;
    /** Minutos até que a página seja recarregada automaticamente. */
    minutesUntilReload: number;
};

export type PlunderStateValue = PlunderState[keyof PlunderState];

export type PlunderTableButtons = {
    /** Botão A do assistente de saque. */
    a: HTMLAnchorElement | null;
    /** Botão B do assistente de saque. */
    b: HTMLAnchorElement | null;
    /** Botão C do assistente de saque. */
    c: HTMLAnchorElement | null;
    /** Botão para abrir a janela de comandos no assistente de saque. */
    place: HTMLAnchorElement | null;
};

export type PlunderTableResources = {
    /** Estimativa da quantidade de madeira disponível na aldeia. */
    wood: number;
    /** Estimativa da quantidade de argila disponível na aldeia. */
    stone: number;
    /** Estimativa da quantidade de ferro disponível na aldeia. */
    iron: number;
    /** Total de recursos que se espera ter na aldeia. */
    total: number;
};