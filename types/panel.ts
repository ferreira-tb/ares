export type PanelStoreType = {
    /** Porta para comunicação com o worker do Phobos. */
    readonly phobosWorkerPort: MessagePort | null;
    /** Mapa contendo os grupos de aldeias (ID e nome, respectivamente). */
    readonly villageGroups: Map<number, string>;
};