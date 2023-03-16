import { URL } from 'url';
import { ipcMain, BrowserView } from 'electron';
import { computed, storeToRefs } from 'mechanus';
import { useBrowserViewStore } from '$interface/index';
import { gameURL } from '$electron/utils/constants';
import { isAllowedURL } from '$electron/utils/guards';
import { getMainWindow } from '$electron/utils/helpers';
import { BrowserViewError } from '$electron/error';
import type { WebContents, BrowserWindow } from 'electron';
import type { MechanusComputedRef } from 'mechanus';

import {
    insertViewCSS,
    // setBrowserViewBounds,
    // setBrowserViewAutoResize,
    getBackForwardStatus,
    getMainViewWebContents
} from '$electron/utils/view';

export function setBrowserViewEvents() {
    const browserViewStore = useBrowserViewStore();
    const { allWebContents, currentWebContents } = storeToRefs(browserViewStore);

    // Adiciona o WebContents da BrowserView principal à lista de WebContents.
    const mainViewWebContents = getMainViewWebContents();
    allWebContents.value.add(mainViewWebContents);
    setWindowOpenHandler(mainViewWebContents);

    // View principal.
    ipcMain.on('reload-main-view', () => mainViewWebContents.reload());
    ipcMain.on('force-reload-main-view', () => mainViewWebContents.reloadIgnoringCache());
    ipcMain.handle('main-view-web-contents-id', () => mainViewWebContents.id);
    ipcMain.handle('main-view-url', () => mainViewWebContents.getURL());

    // Computa o WebContents atualmente ativo (em primeiro plano).
    const currentView = computed<WebContents>([currentWebContents], () => {
        if (currentWebContents.value) return currentWebContents.value;
        return getMainViewWebContents();
    });

    // Os eventos abaixo estão relacionados à BrowserView atual.
    // No entanto, não precisam ser definidos separadamente, pois são obtidos dinamicamente.
    ipcMain.handle('current-view-url', () => currentView.value.getURL());
    ipcMain.on('current-view-go-home', () => currentView.value.loadURL(gameURL));
    ipcMain.handle('current-view-can-go-back', () => currentView.value.canGoBack());
    ipcMain.handle('current-view-can-go-forward', () => currentView.value.canGoForward());

    ipcMain.on('current-view-go-back', () => {
        if (currentView.value.canGoBack()) {
            currentView.value.goBack();
        };
    });

    ipcMain.on('current-view-go-forward', () => {
        if (currentView.value.canGoForward()) {
            currentView.value.goForward();
        };
    });

    // Define os eventos compartilhados entre todas as BrowserViews.
    setViewSharedEvents();
    // Define os eventos específicos da BrowserView atual.
    setCurrentViewEvents(currentView);
};

/**
 * Define os eventos compartilhados entre todas as BrowserViews.
 * Esses eventos devem ser removidos quando a BrowserView for destruída.
 * @param webContents WebContents da BrowserView.
 */
function setViewSharedEvents() {
    const mainWindow = getMainWindow();
    const mainViewWebContents = getMainViewWebContents();
    const browserViewStore = useBrowserViewStore();
    const { allWebContents, registeredWebContents } = storeToRefs(browserViewStore);

    for (const webContents of allWebContents.value) {
        // Verifica se os eventos já foram definidos.
        if (registeredWebContents.value.has(webContents)) continue;

        // Impede que o usuário navegue para fora da página do jogo.
        webContents.on('will-navigate', (e, url) => {
            if (!isAllowedURL(url)) e.preventDefault();
        });

        webContents.on('page-title-updated', (_e, title) => {
            if (webContents === mainViewWebContents) return;
            mainWindow.webContents.send('browser-view-title-updated', webContents.id, title);
        });

        webContents.once('destroyed', () => handleDestroyedBrowserView(webContents));

        // Adiciona o WebContents à lista de WebContents com eventos já registrados.
        registeredWebContents.value.add(webContents);
    };
};

/**
 * Define os eventos específicos da BrowserView atual.
 * Esses eventos devem ser removidos quando a BrowserView for destruída.
 * @param currentView WebContents da BrowserView atual.
 */
function setCurrentViewEvents(currentView: MechanusComputedRef<WebContents>) {
    const mainWindow = getMainWindow();

    currentView.value.on('did-start-loading', () => {
        mainWindow.webContents.send('current-view-did-start-loading');
    });

    currentView.value.on('did-stop-loading', () => {
        mainWindow.webContents.send('current-view-did-stop-loading');
    });

    currentView.value.on('did-navigate', () => {
        insertViewCSS(currentView.value);
        updateCurrentViewBackForwardStatus(currentView);
    });

    currentView.value.on('did-navigate-in-page', () => {
        updateCurrentViewBackForwardStatus(currentView);
    });

    currentView.value.on('did-frame-navigate', () => {
        updateCurrentViewBackForwardStatus(currentView);
    });

    currentView.value.on('did-redirect-navigation', () => {
        updateCurrentViewBackForwardStatus(currentView);
    });
};

/**
 * Cria uma nova BrowserView.
 * Se a URL não for permitida, a função é interrompida.
 * @param rawUrl URL da nova BrowserView.
 * @returns BrowserView criada ou `null` se algo impedir a criação.
 */
async function createBrowserView(rawUrl: string): Promise<BrowserView | null> {
    try {
        const browserView = new BrowserView({
            webPreferences: {
                spellcheck: false,
                nodeIntegration: false,
                contextIsolation: true,
                devTools: process.env.ARES_MODE === 'dev',
            }
        });

        // Cria uma instância de URL para verificar se a URL é válida.
        const url = new URL(rawUrl);
        if (!isAllowedURL(url.href)) return null;

        const mainWindow = getMainWindow();
        mainWindow.addBrowserView(browserView);
        setViewSharedEvents();
        
        const contents = browserView.webContents;
        await contents.loadURL(url.href);
        setWindowOpenHandler(contents);

        // Envia o ID e o título da BrowserView para a janela principal.
        // Isso é necessário para que a janela principal possa criar uma nova aba.
        mainWindow.webContents.send('browser-view-created', contents.id, contents.getTitle());
        return browserView;

    } catch (err) {
        BrowserViewError.catch(err);
        return null;
    };
};

function handleDestroyedBrowserView(contents: WebContents) {
    let mainWindow: BrowserWindow;
    let mainViewWebContents: WebContents;

    // Se a janela principal ou a BrowserView principal não existirem,
    // conclui-se que a aplicação está sendo encerrada.
    try {
        mainWindow = getMainWindow();
        mainViewWebContents = getMainViewWebContents();
    } catch {
        return;
    };

    try {
        const browserViewStore = useBrowserViewStore();
        const { allWebContents, registeredWebContents } = storeToRefs(browserViewStore);

        // Verifica se o WebContents é o da BrowserView principal.
        // Se for, os eventos não devem ser removidos.
        if (contents === mainViewWebContents) return;

        // Remove os eventos compartilhados entre todas as BrowserViews.
        contents.removeAllListeners();
        // Remove o WebContents da lista de WebContents com eventos já registrados.
        registeredWebContents.value.delete(contents);
        // Remove o WebContents da lista de WebContents.
        allWebContents.value.delete(contents);
        // Notifica a janela principal que a BrowserView foi destruída.
        mainWindow.webContents.send('browser-view-destroyed', contents.id);

    } catch (err) {
        BrowserViewError.catch(err);
    };
};

function updateCurrentViewBackForwardStatus(view: MechanusComputedRef<WebContents>) {
    const mainWindow = getMainWindow();
    const backForwardStatus = getBackForwardStatus(view.value);
    mainWindow.webContents.send('current-view-back-forward-status', backForwardStatus);
};

function setWindowOpenHandler(contents: WebContents) {
    contents.setWindowOpenHandler(({ url }) => {
        queueMicrotask(() => createBrowserView(url));
        return { action: 'deny' };
    });
};