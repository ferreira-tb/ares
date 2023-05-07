import { readFile } from 'node:fs/promises';
import { webContents } from 'electron';
import { browserCss } from '$electron/utils/files';
import { getMainWindow } from '$electron/utils/helpers';
import { Dimensions, GameUrl } from '$global/constants';
import { BrowserViewError } from '$electron/error';
import type { WebContents, BrowserView, BrowserWindow, IpcMainEvent } from 'electron';
import type { BackForwardStatus } from '$types/view';
import type { GameRegion } from '$types/game';

export const getMainViewWebContents = () => {
    const id = Number.parseIntStrict(process.env.MAIN_VIEW_WEB_CONTENTS_ID ?? '');
    const mainViewWebContents = webContents.fromId(id);
    if (!mainViewWebContents) throw new BrowserViewError('Could not get main view web contents.');
    return mainViewWebContents;
};

export function setBrowserViewBounds(view: BrowserView, mainWindow: BrowserWindow = getMainWindow()) {
    const { width, height } = mainWindow.getContentBounds();
    view.setBounds({ x: 0, y: Dimensions.TopContainerHeight, width, height: height - Dimensions.TopContainerHeight });
};

/**
 * Define o evento de redimensionamento automático do BrowserView.
 * @param view BrowserView a ser redimensionado.
 * @returns Função para remover o evento de redimensionamento.
 */
export function setBrowserViewAutoResize(view: BrowserView, mainWindow: BrowserWindow = getMainWindow()): () => void {
    let timeout: ReturnType<typeof setImmediate> | null = null;
    function resize(e: IpcMainEvent) {
        e.preventDefault();
        timeout = setImmediate(() => {
            if (timeout) clearImmediate(timeout);
            const { width, height } = mainWindow.getContentBounds();
            view.setBounds({ x: 0, y: Dimensions.TopContainerHeight, width, height: height - Dimensions.TopContainerHeight });
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

export function contentsGoHome(contents: WebContents, region: GameRegion) {
    let homeUrl: GameUrl;
    switch (region) {
        case 'br':
            homeUrl = GameUrl.Brazil;
            break;
        case 'en':
            homeUrl = GameUrl.Global;
            break;
        case 'nl':
            homeUrl = GameUrl.Netherlands;
            break;
        case 'pt':
            homeUrl = GameUrl.Portugal;
            break;
        case 'uk':
            homeUrl = GameUrl.UnitedKingdom;
            break;
        case 'us':
            homeUrl = GameUrl.UnitedStates;
            break;
        default:
            homeUrl = GameUrl.Brazil;
    };

    contents.loadURL(homeUrl).catch(BrowserViewError.catch);
};

/**
 * Insere CSS no WebContents.
 * @param contents WebContents da BrowserView.
 * @param css CSS a ser inserido. Se omitido, será usado o CSS padrão do browser.
 */
export async function insertViewCSS(contents?: WebContents, css?: string) {
    try {
        contents ??= getMainViewWebContents();
        css ??= await readFile(browserCss, { encoding: 'utf8' });
        await contents.insertCSS(css);
    } catch (err) {
        BrowserViewError.catch(err);
    };
};