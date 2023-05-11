type BrowserViewConstructorOptions = import('electron').BrowserWindowConstructorOptions;
type WebContents = import('electron').WebContents;

type WindowOpenHandler = ReturnType<Parameters<WebContents['setWindowOpenHandler']>[0]>;

type ElectronMessageBoxOptions = Pick<import('electron').MessageBoxOptions,
    'buttons' | 'cancelId' | 'defaultId' | 'message' | 'noLink' | 'title' | 'type'
>;