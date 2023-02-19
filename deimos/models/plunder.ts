import { assertBoolean, assertInteger } from '@tb-dev/ts-guard';
import type { RawPlunderInfo, PlunderInfoType } from '$types/deimos.js';

export class PlunderInfo implements PlunderInfoType {
    public readonly hideAttacked: boolean;
    public readonly page: number;
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