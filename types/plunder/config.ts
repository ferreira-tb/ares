import type { WallLevel } from '$types/game';

/**
 * Padrão de ataque quando o Plunder não tem informações dos exploradores.
 * 
 * `bigger`: Ataca com a maior capacidade de carga possível.
 * 
 * `smaller`: Ataca com a menor capacidade de carga possível.
 */
export type BlindAttackPattern = 'bigger' | 'smaller';

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
export type UseCPattern = 'excess' | 'normal' | 'only';

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

export type PlunderPanelConfig = Pick<PlunderConfigType,
    'active' | 'blindAttack' | 'destroyWall' | 'groupAttack' | 'ignoreDelay' | 'ignoreWall' | 'useC'
>;

export type PlunderPanelConfigKeys = keyof PlunderPanelConfig;
export type PlunderPanelConfigValues = PlunderPanelConfig[PlunderPanelConfigKeys];