export type LatestVersion = {
    readonly version: string;
    readonly notes: string;
    readonly download: string;

    readonly isAlpha: boolean;
    readonly date: number;
};

export type DownloadProgressType = {
    readonly receivedBytes: number;
    readonly totalBytes: number;
};