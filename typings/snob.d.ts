type SnobConfigType = {
    /** Indica se a cunhagem automática está ativa. */
    active: boolean;
    /** Indica o modo de cunhagem. */
    mode: 'single' | 'group';
    /** Intervalo entre as cunhagens. A unidade de tempo é definida por `timeUnit`. */
    delay: number;
    /** Unidade de tempo do intervalo. */
    timeUnit: 'seconds' | 'minutes' | 'hours';
    /** Aldeia onde a cunhagem será feita quando no modo `single`. */
    village: number | null;
    /** Grupo a partir do qual ocorrerá a cunhagem quando no modo `group`. */
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