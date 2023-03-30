import type { FarmUnitsAmount, UnitsToDestroyWall } from '$types/game';
import type { UserAlias } from '$types/electron';

export type PlunderInfoType = {
    /** Indica se as aldeias sob ataque estão ocultas. */
    readonly hideAttacked: boolean;
    /** Página atual. */
    readonly page: number;
    /**
     * Quantidade de aldeias por página.
     * 
     * O valor dessa propriedade é `NaN` quando a tabela do assistente de saque está vazia.
     * Nesse caso, em vez de manter como `NaN`, usa-se `null`.
     */
    readonly pageSize: number | null;
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

/**
 * Padrão de ataque quando o Plunder está usando o modelo C.
 * 
 * normal: Tenta utilizar o modelo C, se não for possível, utiliza outro modelo.
 * 
 * only: Utiliza apenas o modelo C.
 */
export type UseCPattern = 'normal' | 'only';

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
    /** Razão entre a quantidade de recursos esperados e a capacidade de carga do modelo atacante. */
    resourceRatio: number;
    /** Minutos até que a página seja recarregada automaticamente. */
    minutesUntilReload: number;
    /** Distância máxima para os ataques normais do Plunder. */
    maxDistance: number;
    /** Ignora aldeias cujo último ataque ocorreu há uma quantidade de horas superior à indicada. */
    ignoreOlderThan: number;
    /**
     * Por padrão, o Plunder sempre assume que o modelo saqueou 100% de sua capacidade de carga.
     * No entanto, essa opção permite ao usuário alterar o valor padrão.
     */
    plunderedResourcesRatio: number;
    /** Delay médio entre cada troca de página. */
    pageDelay: number;

    /** ID do grupo que será utilizado para atacar. */
    plunderGroupId: number | null;
    /** Máximo de campos por onda. */
    fieldsPerWave: number;

    /** Determina o padrão de ataque quando o Plunder não tem informações dos exploradores. */
    blindAttackPattern: BlindAttackPattern;
    /** Determina o padrão de ataque quando o Plunder está usando o modelo C. */
    useCPattern: UseCPattern;
};

export type PlunderConfigKeys = keyof PlunderConfigType;
export type PlunderConfigValues = PlunderConfigType[PlunderConfigKeys];

export type PlunderPanelConfig = Pick<PlunderConfigType,
    | 'active'
    | 'ignoreWall'
    | 'destroyWall'
    | 'groupAttack'
    | 'useC'
    | 'ignoreDelay'
    | 'blindAttack'
>;

export type PlunderPanelConfigKeys = keyof PlunderPanelConfig;
export type PlunderPanelConfigValues = PlunderPanelConfig[PlunderPanelConfigKeys];

export type PlunderHistoryType = {
    last: PlunderAttackDetails;
    total: PlunderAttackDetails;
};

export type PlunderPageType = {
    /** Número da página. */
    readonly page: number;
    /** Indica se o Plunder já enviou ataques a partir dessa página. */
    done: boolean;
};

export type PlunderCurrentVillageType = {
    /** ID da aldeia. */
    readonly id: number;
    /** URL base das páginas. */
    readonly pageUrl: string;
    /** Lista de páginas. */
    readonly pages: PlunderPageType[];
};

export type PlunderGroupVillageType = {
    /** Distância coberta pela última onda de ataques. */
    waveMaxDistance: number;
    /** Indica se o Plunder já enviou todos os ataques possíveis a partir dessa aldeia. */
    done: boolean;
};

export type PlunderGroupType = {
    /** ID do grupo. */
    readonly id: number;
    /** Mapa contento as aldeias do grupo. As chaves são os IDs das aldeias. */
    readonly villages: Map<number, PlunderGroupVillageType>;
};

export type PlunderCacheType = {
    /** Informações sobre a aldeia atual, como, por exemplo, os status de cada página. */
    readonly currentVillage: PlunderCurrentVillageType | null;
    /** Informações sobre o grupo de saque. */
    readonly plunderGroup: PlunderGroupType | null;
    /** Modelos usados no assistente de saque para demolição de muralhas. */
    readonly demolitionTroops: DemolitionTemplateType | null;
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

export type CustomPlunderTemplateType = {
    /** Alias do usuário. */
    alias: UserAlias;
    /** Nome do modelo. */
    type: string;
    /** Descrição do modelo. */
    description: string | null;
    /** Quantidade de unidades de cada tipo. */
    readonly units: Omit<FarmUnitsAmount, 'knight'>;
};

export type DemolitionTemplateType = {
    /** Alias do usuário. */
    alias: UserAlias;
    /** Modelos. */
    units: UnitsToDestroyWall;
};