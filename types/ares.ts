export type LatestVersion = {
    readonly version: string;
    readonly notes: string;
    readonly download: string;
};

export type DownloadProgressType = {
    readonly receivedBytes: number;
    readonly totalBytes: number;
};