export class SnobHistoryEntry implements SnobHistoryEntryType {
    readonly addedAt: number = new Date().setUTCHours(0, 0, 0, 0);
    coins: number = 0;
};