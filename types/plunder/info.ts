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