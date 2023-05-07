export type EnvironmentInfo = {
    readonly time: number;
    readonly ares: string;
    readonly electron: string;
    readonly chrome: string;
    readonly tribal: string | null;
    readonly locale: string | null;
};

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