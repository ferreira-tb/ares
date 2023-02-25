export interface PlunderInfoType {
    /** Indica se as aldeias sob ataque estão ocultas. */
    readonly hideAttacked: boolean;
    /** Página atual. */
    readonly page: number;
    /** Quantidade de aldeias por página. */
    readonly pageSize: number;
    readonly plunderExhausted: boolean;
};

/**
 * Padrão de ataque quando o Plunder não tem informações dos exploradores.
 * 
 * bigger: Ataca com a maior capacidade de carga possível.
 * 
 * smaller: Ataca com a menor capacidade de carga possível.
 */
export type BlindAttackPattern = 'bigger' | 'smaller';

export type PlunderConfigType = {
    // Painel
    /** Indica se o Plunder está ativado. */
    active: boolean;
    /** Determina se o Plunder deve atacar aldeias com muralha. */
    ignoreWall: boolean;
    /** Determina se o Plunder deve demolir a muralha das aldeias. */
    destroyWall: boolean;
    /** Determina se o Plunder deve utilizar o grupo Insidious ao atacar. */
    groupAttack: boolean;
    /** Determina se o Plunder deve atacar usando o modelo C. */
    useC: boolean;
    /** Se ativado, o Plunder não terá delay entre os ataques. */
    ignoreDelay: boolean;
    /** Se ativado, o Plunder não levará em consideração as informações dos exploradores. */
    blindAttack: boolean;

    // Configurações
    /** Nível da muralha a partir do qual ele deve ignorar. */
    wallLevelToIgnore: number;
    /** Nível da muralha a partir do qual ele deve demolir. */
    wallLevelToDestroy: number;
    /** Distância máxima para ataques de destruição de muralha. */
    destroyWallMaxDistance: number;
    /** Delay médio entre os ataques. */
    attackDelay: number;
    /** Determina o padrão de ataque quando o Plunder não tem informações dos exploradores. */
    blindAttackPattern: BlindAttackPattern;
    /** Razão entre a quantidade de recursos esperados e a capacidade de carga do modelo atacante. */
    resourceRatio: number;
    /** Minutos até que a página seja recarregada automaticamente. */
    minutesUntilReload: number;
    /** Distância máxima para os ataques normais do Plunder. */
    maxDistance: number;
    /** Ignora aldeias cujo último ataque ocorreu há uma quantidade de horas superior à indicada. */
    ignoreOlderThan: number;
};

export type PlunderConfigKeys = keyof PlunderConfigType;
export type PlunderConfigValues = PlunderConfigType[PlunderConfigKeys];

export type PlunderHistoryType = {
    last: PlunderAttackDetails;
    total: PlunderAttackDetails;
};

export type PlunderAttackDetails = {
    wood: number;
    stone: number;
    iron: number;
    total: number;
    attackAmount: number;
    destroyedWalls: number;
};

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