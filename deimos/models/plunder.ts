import { assertBoolean, assertInteger } from '@tb-dev/ts-guard';
import type { RawPlunderInfo } from '$types/deimos.js';

export class PlunderInfo {
    /** Indica se as aldeias sob ataque estão ocultas. */
    public readonly hideAttacked: boolean;
    /** Página atual. */
    public readonly page: number;
    /** Quantidade de aldeias por página. */
    public readonly pageSize: number;
    public readonly plunderExhausted: boolean;

    constructor(rawPlunderInfo: RawPlunderInfo) {
        assertBoolean(rawPlunderInfo.hide_attacked);
        this.hideAttacked = rawPlunderInfo.hide_attacked;
        
        assertInteger(rawPlunderInfo.page);
        this.page = rawPlunderInfo.page;

        assertInteger(rawPlunderInfo.page_size);
        this.pageSize = rawPlunderInfo.page_size;

        assertBoolean(rawPlunderInfo.plunders_exhausted);
        this.plunderExhausted = rawPlunderInfo.plunders_exhausted;
    };
};