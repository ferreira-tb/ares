type SnobConfigType = {
    /** Indica se a cunhagem automática está ativa. */
    active: boolean;
    /** Indica o modo de cunhagem. */
    mode: 'group' | 'single';
    /** Aldeia onde cunhagens simples serão feitas. */
    village: number | null;
    /** Grupo onde cunhagens em grupo serão feitas. */
    group: number | null;
};