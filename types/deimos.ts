export type DeimosEndpoint = `http://127.0.0.1:${string}/deimos`;

export interface DeimosReport {
    /** Quantidade de recursos que se espera ter na aldeia. */  
    readonly expected: number;
    /** Capacidade de carga do modelo atacante. */
    readonly carry: number;
    /** Coordenadas da aldeia atacante. */
    readonly origin_x: number;
    readonly origin_y: number;
    /** Coordenadas da aldeia defensora. */
    readonly dest_x: number;
    readonly dest_y: number;
    /** Minutos desde o último ataque. */
    readonly minutes_since: number;
};

export interface FullDeimosReport extends DeimosReport {
    /** ID do relatório. */
    readonly report_id: number;
    /** Data do ataque (em segundos desde a época UNIX). */
    readonly time: number;
    /** Mundo onde ocorreu a batalha. */
    readonly world: string;
    /** Quantia saqueada no último ataque (esse valor deve ser previsto pelo Deimos). */
    readonly plundered: number;
}

export type DeimosReportInfo = Pick<FullDeimosReport, 'report_id' | 'world'>;