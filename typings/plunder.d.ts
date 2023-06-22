/**
 * Padrão de ataque quando o Plunder não tem informações dos exploradores.
 * 
 * `bigger`: Ataca com a maior capacidade de carga possível.
 * 
 * `smaller`: Ataca com a menor capacidade de carga possível.
 */
type BlindAttackPattern = 'bigger' | 'smaller';

/**
 * Padrão de ataque quando o Plunder está usando o modelo C.
 * 
 * `normal`: Tenta utilizar o modelo C, se não for possível, utiliza outro.
 * 
 * `excess`: Utiliza o modelo C apenas se a razão entre a quantidade de recursos esperados e a
 * capacidade de carga do modelo atacante for maior que o valor indicado em `useCWhenResourceRatioIsBiggerThan`.
 * 
 * `only`: Utiliza apenas o modelo C.
 */
type UseCPattern = 'excess' | 'normal' | 'only';

type PlunderConfigType = {
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

    // Ataque
    /** Distância máxima para os ataques normais do Plunder. */
    maxDistance: number;
    /** Ignora aldeias cujo último ataque ocorreu há uma quantidade de horas superior à indicada. */
    ignoreOlderThan: number;
    /** Delay médio entre os ataques. */
    attackDelay: number;
    /** Razão entre a quantidade de recursos esperados e a capacidade de carga do modelo atacante. */
    resourceRatio: number;
    /** Determina o padrão de ataque quando o Plunder não tem informações dos exploradores. */
    blindAttackPattern: BlindAttackPattern;

    // Modelo C
    /** Determina o padrão de ataque quando o Plunder está usando o modelo C. */
    useCPattern: UseCPattern;
    /** Distância máxima para ataques usando o modelo C. */
    maxDistanceC: number;
    /** Ao usar o modelo C, ignora aldeias cujo último ataque ocorreu há uma quantidade de horas superior à indicada. */
    ignoreOlderThanC: number;
    /**
     * Utiliza o modelo C apenas se a razão entre a quantidade de recursos esperados e a
     * capacidade de carga do modelo atacante for maior que o valor indicado.
     */
    useCWhenResourceRatioIsBiggerThan: number;

    // Grupo
    /** ID do grupo que será utilizado para atacar. */
    plunderGroupId: number | null;
    /** Máximo de campos por onda. */
    fieldsPerWave: number;
    /** Delay médio entre cada troca de aldeia. */
    villageDelay: number;

    // Muralha
    /** Nível da muralha a partir do qual ele deve ignorar. */
    wallLevelToIgnore: WallLevel;
    /** Nível da muralha a partir do qual ele deve demolir. */
    wallLevelToDestroy: WallLevel;
    /** Distância máxima para ataques de destruição de muralha. */
    destroyWallMaxDistance: number;

    // Outros
    /** Minutos até que a página seja recarregada automaticamente. */
    minutesUntilReload: number;
    /**
     * Por padrão, o Plunder sempre assume que o modelo saqueou 100% de sua capacidade de carga.
     * No entanto, essa opção permite ao usuário alterar o valor padrão.
     */
    plunderedResourcesRatio: number;
    /** Delay médio entre cada troca de página. */
    pageDelay: number;
};

type PlunderPanelConfig = Pick<PlunderConfigType,
    'active' | 'blindAttack' | 'destroyWall' | 'groupAttack' | 'ignoreDelay' | 'ignoreWall' | 'useC'
>;

type PlunderPanelConfigKeys = keyof PlunderPanelConfig;
type PlunderPanelConfigValues = PlunderPanelConfig[PlunderPanelConfigKeys];

type PlunderCacheType = {
    /** Páginas do assistente de saque referentes à aldeia atual. */
    readonly pages: PlunderPageListType | null;
    /** Informações sobre o grupo de saque. */
    readonly plunderGroup: PlunderGroupType | null;
    /** Modelos usados no assistente de saque para demolição de muralhas. */
    readonly demolitionTroops: DemolitionTemplateType | null;
};

type PlunderGroupVillageType = {
    /** Distância coberta pela última onda de ataques. */
    waveMaxDistance: number;
    /** Indica se o Plunder já enviou todos os ataques possíveis a partir dessa aldeia. */
    done: boolean;
};

type PlunderGroupType = {
    /** ID do grupo. */
    readonly id: number;
    /** Mapa contento as aldeias do grupo. As chaves são os IDs das aldeias. */
    readonly villages: Map<number, PlunderGroupVillageType>;
};

type PlunderAttackLog = {
    wood: number;
    stone: number;
    iron: number;
    attackAmount: number;
    destroyedWalls: number;
};

interface PlunderHistoryVillageType extends PlunderAttackLog {
    readonly addedAt: number;
}

interface PlunderHistoryType extends PlunderAttackLog {
    /** Histórico individual de cada aldeia nos últimos 30 dias. */
    readonly villages: {
        [id: string]: PlunderHistoryVillageType[];
    };
}

type PlunderHistoryVillageData = {
    readonly coords: string;
    readonly name: string;
    readonly total: number;
    readonly attackAmount: number;
    readonly destroyedWalls: number;
    score: number;
};

type PlunderHistoryDataTableHeaderProps = PlunderAttackLog & { average: number };

type PlunderInfoType = {
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

type PlunderPageType = {
    /** Índice da página (inicia em zero). */
    readonly index: number;
    /** Indica se o Plunder já enviou ataques a partir dessa página. */
    done: boolean;
}

type PlunderPageListType = {
    /** ID da aldeia a qual as páginas pertencem. */
    readonly id: number;
    /** Lista de páginas. */
    readonly all: PlunderPageType[];
};

type PlunderTableButtons = {
    /** Botão A do assistente de saque. */
    a: HTMLAnchorElement | null;
    /** Botão B do assistente de saque. */
    b: HTMLAnchorElement | null;
    /** Botão C do assistente de saque. */
    c: HTMLAnchorElement | null;
    /** Botão para abrir a janela de comandos no assistente de saque. */
    place: HTMLAnchorElement | null;
};

type PlunderTableResources = {
    /** Estimativa da quantidade de madeira disponível na aldeia. */
    wood: number;
    /** Estimativa da quantidade de argila disponível na aldeia. */
    stone: number;
    /** Estimativa da quantidade de ferro disponível na aldeia. */
    iron: number;
    /** Total de recursos que se espera ter na aldeia. */
    total: number;
};

type CustomPlunderTemplateType = {
    /** Alias do usuário. */
    alias: UserAlias;
    /** Nome do modelo. */
    type: string;
    /** Descrição do modelo. */
    description: string | null;
    /** Quantidade de unidades de cada tipo. */
    readonly units: Omit<FarmUnitsAmount, 'knight'>;
};

type DemolitionTemplateType = {
    /** Alias do usuário. */
    alias: UserAlias;
    /** Modelos. */
    units: UnitsToDestroyWall;
};