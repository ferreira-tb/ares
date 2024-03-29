type AppDebugInfo = {
    readonly uuid: string;
    readonly channel: string;
    readonly from: string;
    readonly to: string;
    readonly time: number;
    readonly data: unknown[];
};

type SequelizeModel = import('sequelize').Model<T, U>;
type WindowOpenHandler = ReturnType<Parameters<Electron.WebContents['setWindowOpenHandler']>[0]>;

type BrowserWindowOptions = Electron.BrowserWindowConstructorOptions;
type MessageBoxOptions = Pick<Electron.MessageBoxOptions,
    'buttons' | 'cancelId' | 'defaultId' | 'message' | 'noLink' | 'title' | 'type'
>;

type ContextMenuOptions = {
    readonly x: number;
    readonly y: number;
};

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