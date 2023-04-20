export type PlunderGroupVillageType = {
    /** Distância coberta pela última onda de ataques. */
    waveMaxDistance: number;
    /** Indica se o Plunder já enviou todos os ataques possíveis a partir dessa aldeia. */
    done: boolean;
};

export type PlunderGroupType = {
    /** ID do grupo. */
    readonly id: number;
    /** Mapa contento as aldeias do grupo. As chaves são os IDs das aldeias. */
    readonly villages: Map<number, PlunderGroupVillageType>;
};