import { getMainWindow } from '$electron/utils/helpers';
import { insertViewCSS, getBackForwardStatus } from '$electron/utils/view';
import { BrowserViewError } from '$electron/error';

/**
 * Define os eventos específicos da BrowserView atual.
 * Esses eventos devem ser removidos quando a BrowserView for destruída.
 * 
 * Se um novo evento for adicionado, é preciso adicionar a remoção dele na função `removePreviousViewEvents`.
 * @param view WebContents da BrowserView atual.
 */
export function setCurrentViewEvents(view: Electron.WebContents) {
    const mainWindow = getMainWindow();

    view.on('did-start-loading', () => {
        mainWindow.webContents.send('current-view:did-start-loading');
    });

    view.on('did-stop-loading', () => {
        mainWindow.webContents.send('current-view:did-stop-loading');
    });

    view.on('did-navigate', () => {
        insertViewCSS(view).catch(BrowserViewError.catch);
        updateCurrentViewBackForwardStatus(view);
    });

    view.on('did-navigate-in-page', () => {
        updateCurrentViewBackForwardStatus(view);
    });

    view.on('did-frame-navigate', () => {
        updateCurrentViewBackForwardStatus(view);
    });

    view.on('did-redirect-navigation', () => {
        updateCurrentViewBackForwardStatus(view);
    });
};

/**
 * Remove todos os eventos da BrowserView atual.
 * Essa função deve ser chamada quando a BrowserView atual for alterada.
 * 
 * Esses eventos são definidos na função `setCurrentViewEvents`.
 * @param view WebContents da BrowserView atual.
 */
export function removePreviousViewEvents(view: Electron.WebContents) {
    view.removeAllListeners('did-start-loading');
    view.removeAllListeners('did-stop-loading');
    view.removeAllListeners('did-navigate');
    view.removeAllListeners('did-navigate-in-page');
    view.removeAllListeners('did-frame-navigate');
    view.removeAllListeners('did-redirect-navigation');
};

/**
 * Envia à janela principal informações sobre a capacidade de voltar e avançar da BrowserView atual.
 * @param view WebContents da BrowserView atual.
 * @param mainWindow Janela principal.
 */
function updateCurrentViewBackForwardStatus(view: Electron.WebContents) {
    const mainWindow = getMainWindow();
    const backForwardStatus = getBackForwardStatus(view);
    mainWindow.webContents.send('current-view-back-forward-status', backForwardStatus);
};