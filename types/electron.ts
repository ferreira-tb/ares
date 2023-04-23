import type { MessageBoxOptions, WebContents } from 'electron';

export type WindowOpenHandler = ReturnType<Parameters<WebContents['setWindowOpenHandler']>[0]>;

export type ElectronMessageBoxOptions = Pick<MessageBoxOptions,
    'buttons' | 'cancelId' | 'defaultId' | 'message' | 'noLink' | 'title' | 'type'
>;