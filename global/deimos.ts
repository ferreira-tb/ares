import { assertInteger } from "#/error.js";

export class BaseDeimosReport {
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
    
    constructor(
        expected: number,
        carry: number,
        originX: number,
        originY: number,
        destX: number,
        destY: number,
        minutes: number
    ) {
        this.expected = expected;
        this.carry = carry;
        this.origin_x = originX;
        this.origin_y = originY;
        this.dest_x = destX;
        this.dest_y = destY;
        this.minutes_since = minutes;

        for (const value of Object.values(this)) {
            assertInteger(value);
        };
    };
};