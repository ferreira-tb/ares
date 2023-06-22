import { Kronos } from '@tb-dev/kronos';

export class DefaultSnobConfig implements SnobConfigType {
    public readonly active = false;
    public readonly mode = 'single';
    public readonly delay = Kronos.Minute * 5;
    public readonly timeUnit = 'minutes';
    public readonly village = null;
    public readonly group = 0;
}
export class DefaultSnobHistory implements SnobHistoryType {
    public readonly coins = 0;
    public readonly villages = {};
}

export class SnobHistoryEntry implements SnobHistoryEntryType {
    public readonly addedAt: number = new Date().setUTCHours(0, 0, 0, 0);
    public coins: number = 0;
}