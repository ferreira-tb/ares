import { assertInteger } from "#/error.js";

export class BaseDeimosReport {
    /** Quantidade de recursos que se espera ter na aldeia. */  
    readonly expected: number
    /** Capacidade de carga do modelo atacante. */
    readonly carry: number
    /** ID da aldeia atacante. */
    readonly atk_id: number
    /** ID da aldeia defensora. */
    readonly def_id: number
    /** Minutos desde o último ataque. */
    readonly minutes_since: number
    
    constructor(expected: number, carry: number, attackId: number, defId: number, minutes: number) {
        this.expected = expected;
        this.carry = carry;
        this.atk_id = attackId;
        this.def_id = defId;
        this.minutes_since = minutes;

        for (const value of Object.values(this)) {
            assertInteger(value);
        };
    };
};

export class DeimosReport extends BaseDeimosReport {
    /** ID do relatório. */
    readonly id: number
    /** Data do ataque (em milisegundos). */
    readonly time: number
    /** Quantia saqueada no último ataque (esse valor deve ser previsto pelo Deimos). */
    readonly plundered: number

    constructor(
        reportId: number,
        attackDate: number,
        expected: number,
        carry: number,
        attackId: number,
        defId: number,
        minutes: number,
        plundered: number
    ) {
        super(expected, carry, attackId, defId, minutes);

        assertInteger(reportId);
        assertInteger(attackDate);
        assertInteger(plundered);

        this.id = reportId;
        this.time = attackDate;
        this.plundered = plundered;
    };
};