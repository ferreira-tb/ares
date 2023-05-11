type SequelizeModel = import('sequelize').Model<T, U>;
type WindowOpenHandler = ReturnType<Parameters<Electron.WebContents['setWindowOpenHandler']>[0]>;

type ElectronMessageBoxOptions = Pick<Electron.MessageBoxOptions,
    'buttons' | 'cancelId' | 'defaultId' | 'message' | 'noLink' | 'title' | 'type'
>;

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