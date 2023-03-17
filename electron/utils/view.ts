import { webContents } from 'electron';
import { getMainWindow } from '$electron/utils/helpers';
import { browserCss, gameURL } from '$electron/utils/constants';
import { BrowserViewError } from '$electron/error';
import type { WebContents, BrowserView, BrowserWindow } from 'electron';
import type { BackForwardStatus } from '$types/view';

export const getMainViewWebContents = () => {
    const id = Number.parseIntStrict(process.env.MAIN_VIEW_WEB_CONTENTS_ID ?? '');
    const mainViewWebContents = webContents.fromId(id);
    return mainViewWebContents;
};

export function setBrowserViewBounds(view: BrowserView, mainWindow: BrowserWindow = getMainWindow()) {
    const { width, height } = mainWindow.getContentBounds();
    view.setBounds({ x: 0, y: 80, width, height: height - 80 });
};

/**
 * Define o evento de redimensionamento automático do BrowserView.
 * @param view BrowserView a ser redimensionado.
 * @returns Função para remover o evento de redimensionamento.
 */
export function setBrowserViewAutoResize(view: BrowserView, mainWindow: BrowserWindow = getMainWindow()): () => void {
    let timeout: NodeJS.Immediate;
    function resize(e: Electron.Event) {
        e.preventDefault();
        timeout = setImmediate(() => {
            if (timeout) clearImmediate(timeout);
            const { width, height } = mainWindow.getContentBounds();
            view.setBounds({ x: 0, y: 80, width, height: height - 80 });
        });
    };

    mainWindow.on('resize', resize);
    return (): void => void mainWindow.removeListener('resize', resize);
};

/**
 * Retorna um objeto com informações sobre a capacidade de navegação do WebContents.
 * @param contents WebContents da janela ou do BrowserView.
 */
export function getBackForwardStatus(contents: WebContents): BackForwardStatus {
    return {
        canGoBack: contents.canGoBack(),
        canGoForward: contents.canGoForward()
    };
};

export function contentsGoBack(contents: WebContents) {
    if (contents.canGoBack()) contents.goBack();
};

export function contentsGoForward(contents: WebContents) {
    if (contents.canGoForward()) contents.goForward();
};

export function contentsGoHome(contents: WebContents) {
    contents.loadURL(gameURL);
};

/**
 * Insere CSS no WebContents.
 * @param contents WebContents da BrowserView.
 * @param css CSS a ser inserido. Se omitido, será usado o CSS padrão do browser.
 */
export async function insertViewCSS(contents?: WebContents, css: string = browserCss) {
    try {
        contents ??= getMainViewWebContents();
        await contents.insertCSS(css);
    } catch (err) {
        BrowserViewError.catch(err);
    };
};