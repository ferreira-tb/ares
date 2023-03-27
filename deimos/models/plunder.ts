import { assertBoolean, assertInteger, isInteger, toNull } from '@tb-dev/ts-guard';
import type { RawPlunderInfo } from '$types/deimos';
import type { PlunderInfoType } from '$types/plunder';

export class PlunderInfo implements PlunderInfoType {
    public readonly hideAttacked: boolean;
    public readonly page: number;
    public readonly pageSize: number | null;
    public readonly plunderExhausted: boolean;

    constructor(rawPlunderInfo: RawPlunderInfo) {
        assertBoolean(rawPlunderInfo.hide_attacked);
        this.hideAttacked = rawPlunderInfo.hide_attacked;
        
        assertInteger(rawPlunderInfo.page);
        this.page = rawPlunderInfo.page;

        // O valor de `page_size` será `NaN` se a tabela do assistente de saque estiver vazia.
        this.pageSize = toNull(rawPlunderInfo.page_size, isInteger);

        assertBoolean(rawPlunderInfo.plunders_exhausted);
        this.plunderExhausted = rawPlunderInfo.plunders_exhausted;
    };
};