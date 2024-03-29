import { assertInteger, isInteger } from '$common/guards';
import { IpcTribalError } from '$ipc/interface/error';

export class PlunderInfo implements PlunderInfoType {
    public readonly hideAttacked: boolean;
    public readonly page: number;
    public readonly pageSize: number | null;
    public readonly plunderExhausted: boolean;

    constructor(rawPlunderInfo: RawPlunderInfo) {
        if (typeof rawPlunderInfo.hide_attacked !== 'boolean') {
            throw new IpcTribalError('hide_attacked value is invalid.');
        };
        this.hideAttacked = rawPlunderInfo.hide_attacked;
        
        assertInteger(rawPlunderInfo.page, 'Could not determine the current page of the plunder table.');
        this.page = rawPlunderInfo.page;

        // O valor de `page_size` será `NaN` se a tabela do assistente de saque estiver vazia.
        this.pageSize = isInteger(rawPlunderInfo.page_size) ? rawPlunderInfo.page_size : null;

        if (typeof rawPlunderInfo.plunders_exhausted !== 'boolean') {
            throw new IpcTribalError('plunders_exhausted value is invalid.');
        };
        this.plunderExhausted = rawPlunderInfo.plunders_exhausted;
    };
};