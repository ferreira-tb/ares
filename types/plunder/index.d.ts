type PlunderCacheType = {
    /** Páginas do assistente de saque referentes à aldeia atual. */
    readonly pages: PlunderPageListType | null;
    /** Informações sobre o grupo de saque. */
    readonly plunderGroup: PlunderGroupType | null;
    /** Modelos usados no assistente de saque para demolição de muralhas. */
    readonly demolitionTroops: DemolitionTemplateType | null;
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