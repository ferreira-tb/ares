import { Kronos } from '@tb-dev/kronos';

export class SnobHistoryEntry implements SnobHistoryEntryType {
    readonly addedAt: number = new Date().setUTCHours(0, 0, 0, 0);
    coins: number = 0;
};

export class DefaultSnobConfig implements SnobConfigType {
    readonly active = false;
    readonly mode = 'single';
    readonly delay = Kronos.Minute * 5;
    readonly timeUnit = 'minutes';
    readonly village = null;
    readonly group = 0;
};