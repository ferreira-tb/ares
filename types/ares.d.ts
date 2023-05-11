type EnvironmentInfo = {
    readonly time: number;
    readonly ares: string;
    readonly electron: string;
    readonly chrome: string;
    readonly tribal: string | null;
    readonly locale: string | null;
};

type LatestVersion = {
    readonly version: string;
    readonly notes: string;
    readonly download: string;

    readonly isAlpha: boolean;
    readonly date: number;
};

type DownloadProgressType = {
    readonly receivedBytes: number;
    readonly totalBytes: number;
};