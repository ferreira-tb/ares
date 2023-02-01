import type { BaseDeimosReport } from "#/deimos.js";

export interface DeimosReport extends BaseDeimosReport {
    /** ID do relatório. */
    readonly id: number;
    /** Data do ataque (em segundos desde a época UNIX). */
    readonly time: number;
    /** Mundo onde ocorreu a batalha. */
    readonly world: string;
    /** Quantia saqueada no último ataque (esse valor deve ser previsto pelo Deimos). */
    readonly plundered: number;
}