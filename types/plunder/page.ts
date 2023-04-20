export type PlunderPageType = {
    /** Índice da página (inicia em zero). */
    readonly index: number;
    /** Indica se o Plunder já enviou ataques a partir dessa página. */
    done: boolean;
}

export type PlunderPageListType = {
    /** ID da aldeia a qual as páginas pertencem. */
    readonly id: number;
    /** Lista de páginas. */
    readonly all: PlunderPageType[];
};