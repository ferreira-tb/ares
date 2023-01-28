import { assertInteger } from "#/error.js";

export class BaseDeimosReport {  
    readonly expected: number
    readonly carry: number
    readonly atk_id: number
    readonly def_id: number
    readonly time: number
    
    constructor(expected: number, carry: number, attackId: number, defId: number, minutes: number) {
        this.expected = expected;
        this.carry = carry;
        this.atk_id = attackId;
        this.def_id = defId;
        this.time = minutes;

        for (const value of Object.values(this)) {
            assertInteger(value);
        };
    };
};

export class DeimosReport extends BaseDeimosReport {
    readonly id: number
    readonly plundered: number

    constructor(
        reportId: number,
        expected: number,
        carry: number,
        attackId: number,
        defId: number,
        minutes: number,
        plundered: number
    ) {
        super(expected, carry, attackId, defId, minutes);

        assertInteger(reportId);
        assertInteger(plundered);

        this.id = reportId;
        this.plundered = plundered;
    };
};