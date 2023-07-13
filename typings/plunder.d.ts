type PlunderConfigType = {
    /** Indica se o Plunder está ativado. */
    active: boolean;
    /** Indica o modo de saque. */
    mode: 'single' | 'group';
    /** Aldeia de onde partirão os ataques quando no modo `single`. */
    village: number | null;
    /** Grupo a partir do qual serão feitos os ataques quando no modo `group`. */
    group: number;

    // Ataque
    /** Distância máxima para os ataques normais do Plunder. */
    maxDistance: number;
    /** Ignora aldeias cujo último ataque ocorreu há uma quantidade de horas superior à indicada. */
    ignoreOlderThan: number;
    /** Razão entre a quantidade de recursos esperados e a capacidade de carga do modelo atacante. */
    ratio: number;
    /** Delay médio entre os ataques. */
    attackDelay: number;
    /**
     * Padrão de ataque quando o Plunder não tem informações dos exploradores.
     * 
     * `bigger`: Ataca com a maior capacidade de carga possível.
     * 
     * `smaller`: Ataca com a menor capacidade de carga possível.
     * 
     * `never`: Nunca ataca às cegas.
     */
    blindAttack: 'bigger' | 'smaller' | 'never';

    // Grupo
    /** Máximo de campos por onda. */
    fieldsPerWave: number;
    /** Delay médio entre cada troca de aldeia. */
    villageDelay: number;

    // Muralha
    /** Determina se o Plunder deve atacar aldeias com muralha. */
    ignoreWall: boolean;
    /** Nível da muralha a partir do qual ele deve ignorar. */
    wallLevelToIgnore: number;
    /** Determina se o Plunder deve demolir a muralha das aldeias. */
    destroyWall: boolean;
    /** Nível da muralha a partir do qual ele deve demolir. */
    wallLevelToDestroy: number;
    /** Distância máxima para a demolição da muralha. */
    destroyWallMaxDistance: number;
    /** Modelo usado para demolir a muralha. */
    demolitionTemplate: number;

    // Modelo C
    /**
     * Padrão de ataque quando o Plunder está usando o modelo C.
     * 
     * `normal`: Tenta utilizar o modelo C, se não for possível, utiliza outro.
     * 
     * `excess`: Utiliza o modelo C apenas se a razão entre a quantidade de recursos esperados e a
     * capacidade de carga do modelo atacante for maior que o valor indicado em `useCWhenRatioIsBiggerThan`.
     * 
     * `only`: Utiliza apenas o modelo C.
     * 
     * `never`: Nunca utiliza o modelo C.
     */
    useC: 'excess' | 'normal' | 'only' | 'never';
    /** Distância máxima para ataques usando o modelo C. */
    maxDistanceC: number;
    /** Ao usar o modelo C, ignora aldeias cujo último ataque ocorreu há uma quantidade de horas superior à indicada. */
    ignoreOlderThanC: number;
    /**
     * Utiliza o modelo C apenas se a razão entre a quantidade de recursos esperados e a
     * capacidade de carga do modelo atacante for maior que o valor indicado.
     */
    useCWhenRatioIsBiggerThan: number;

    // Outros
    /** Minutos até que a página seja recarregada automaticamente. */
    minutesUntilReload: number;
    /**
     * Por padrão, o Plunder sempre assume que o modelo saqueou 100% de sua capacidade de carga.
     * No entanto, essa opção permite ao usuário alterar isso.
     */
    estimate: number;
    /** Delay médio entre cada troca de página. */
    pageDelay: number;
};

type PlunderCacheType = {
    /** Páginas do assistente de saque referentes à aldeia atual. */
    readonly pages: PlunderPageListType | null;
    /** Informações sobre o grupo de saque. */
    readonly plunderGroup: PlunderGroupType | null;
    /** Modelos usados no assistente de saque para demolição de muralhas. */
    readonly demolitionTemplate: PlunderDemolitionTemplateType | null;
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

type PlunderCustomTemplateType = {
    /** Alias do usuário. */
    alias: UserAlias;
    /** Nome do modelo. */
    name: string;
    /** Descrição do modelo. */
    description: string | null;
    /** Quantidade de unidades de cada tipo. */
    readonly units: Omit<PlunderUnitAmount, 'knight'>;
};

type PlunderDemolitionUnits = Omit<UnitAmount, 'knight' | 'militia' | 'snob'>;

interface PlunderDemolitionTemplateTableRow extends PlunderDemolitionUnits {
    readonly level: number;
}

interface PlunderDemolitionTemplateType extends Omit<PlunderCustomTemplateType, 'units'> {
    /** ID do modelo. O modelo padrão terá o ID igual a `-1`. */
    readonly id: number;
    /** Modelos. */
    readonly units: {
        [key: string]: PlunderDemolitionUnits;
    };
}