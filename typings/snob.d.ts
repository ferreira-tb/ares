type SnobConfigType = {
    /** Indica se a cunhagem automática está ativa. */
    active: boolean;
    /** Indica o modo de cunhagem. */
    mode: 'group' | 'single';
    /** Intervalo entre as cunhagens. A unidade de tempo é definida por `timeUnit`. */
    delay: number;
    /** Unidade de tempo do intervalo. */
    timeUnit: 'hours' | 'minutes' | 'seconds';
    /** Aldeia onde cunhagens simples serão feitas. */
    village: number | null;
    /** Grupo onde cunhagens em grupo serão feitas. */
    group: number;
};

type SnobHistoryEntryType = Omit<SnobHistoryType, 'villages'> & {
    readonly addedAt: number;
};

type SnobHistoryType = {
    /** Quantidade de moedas cunhadas. */
    coins: number;
    /** Histórico individual de cada aldeia nos últimos 30 dias. */
    villages: {
        [id: string]: SnobHistoryEntryType[];
    };
};