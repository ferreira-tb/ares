type SnobConfigType = {
    /** Indica se a cunhagem automática está ativa. */
    active: boolean;
    /** Indica o modo de cunhagem. */
    mode: 'group' | 'single';
    /** Intervalo, em milissegundos, entre as cunhagens. */
    delay: number;
    /** Unidade de tempo do intervalo. */
    timeUnit: 'hours' | 'minutes' | 'seconds';
    /** Aldeia onde cunhagens simples serão feitas. */
    village: number | null;
    /** Grupo onde cunhagens em grupo serão feitas. */
    group: number;

    /** Quantidade de moedas cunhadas. */
    coins: number;
};