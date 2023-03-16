import { URL } from 'url';
import { ipcMain, BrowserView } from 'electron';
import { computed, storeToRefs, watch } from 'mechanus';
import { useBrowserViewStore } from '$interface/index';
import { gameURL } from '$electron/utils/constants';
import { isAllowedURL } from '$electron/utils/guards';
import { getMainWindow } from '$electron/utils/helpers';
import { BrowserViewError } from '$electron/error';
import type { WebContents, BrowserWindow } from 'electron';
import type { MechanusRef } from 'mechanus';

import {
    insertViewCSS,
    setBrowserViewBounds,
    setBrowserViewAutoResize,
    getBackForwardStatus,
    getMainViewWebContents
} from '$electron/utils/view';

export function setBrowserViewEvents() {
    const mainWindow = getMainWindow();
    const browserViewStore = useBrowserViewStore();
    const {
        allWebContents,
        currentWebContents,
        currentAutoResize
    } = storeToRefs(browserViewStore);

    // Computa o WebContents atualmente ativo (em primeiro plano).
    const currentView = computed<BrowserView>([currentWebContents], () => {
        const contents = currentWebContents.value ?? getMainViewWebContents();
        return findBrowserViewByWebContentsId(contents.id, mainWindow);
    });

    // Adiciona o WebContents da BrowserView principal à lista de WebContents.
    const mainViewWebContents = getMainViewWebContents();
    allWebContents.value.add(mainViewWebContents);
    setWindowOpenHandler(mainViewWebContents);

    // View principal.
    ipcMain.on('reload-main-view', () => mainViewWebContents.reload());
    ipcMain.on('force-reload-main-view', () => mainViewWebContents.reloadIgnoringCache());
    ipcMain.handle('main-view-web-contents-id', () => mainViewWebContents.id);
    ipcMain.handle('main-view-url', () => mainViewWebContents.getURL());

    // View atual.
    ipcMain.on('update-current-view', (_e, webContentsId: number) => {
        try {
            const view = findBrowserViewByWebContentsId(webContentsId, mainWindow);
            currentWebContents.value = view.webContents;
        } catch (err) {
            BrowserViewError.catch(err);
        };
    });

    // Os eventos abaixo estão relacionados à BrowserView atual.
    // No entanto, não precisam ser definidos separadamente, pois são obtidos dinamicamente dentro da callback.
    ipcMain.handle('current-view-url', () => currentView.value.webContents.getURL());
    ipcMain.handle('current-view-web-contents-id', () => currentView.value.webContents.id);
    ipcMain.on('current-view-go-home', () => currentView.value.webContents.loadURL(gameURL));
    ipcMain.handle('current-view-can-go-back', () => currentView.value.webContents.canGoBack());
    ipcMain.handle('current-view-can-go-forward', () => currentView.value.webContents.canGoForward());

    ipcMain.on('current-view-go-back', () => {
        if (currentView.value.webContents.canGoBack()) {
            currentView.value.webContents.goBack();
        };
    });

    ipcMain.on('current-view-go-forward', () => {
        if (currentView.value.webContents.canGoForward()) {
            currentView.value.webContents.goForward();
        };
    });

    // Define os eventos compartilhados entre todas as BrowserViews.
    setViewSharedEvents(mainWindow, mainViewWebContents);

    // Define os eventos específicos da BrowserView atual.
    setCurrentViewEvents(currentView.value.webContents, mainWindow);

    watch(currentView, (newView, oldView) => {
        // Remove os eventos da BrowserView anterior e define os eventos da nova BrowserView.
        removePreviousViewEvents(oldView.webContents);
        setCurrentViewEvents(newView.webContents, mainWindow);

        // Atualiza as dimensões de ambas as BrowserViews.
        setViewAsTopBrowserView(newView, currentAutoResize, mainWindow);
        hideBrowserView(oldView, currentAutoResize);
    });
};

/**
 * Define os eventos compartilhados entre todas as BrowserViews.
 * Esses eventos devem ser removidos quando a BrowserView for destruída.
 */
function setViewSharedEvents(
    mainWindow: BrowserWindow = getMainWindow(),
    mainViewWebContents: WebContents = getMainViewWebContents()
) {
    const browserViewStore = useBrowserViewStore();
    const { allWebContents, registeredWebContents } = storeToRefs(browserViewStore);

    for (const contents of allWebContents.value) {
        // Verifica se os eventos já foram definidos.
        if (registeredWebContents.value.has(contents)) continue;

        // Impede que o usuário navegue para fora da página do jogo.
        contents.on('will-navigate', (e, url) => {
            if (!isAllowedURL(url)) e.preventDefault();
        });

        contents.on('page-title-updated', (_e) => {
            if (contents === mainViewWebContents) return;
            const title = contents.getTitle();
            mainWindow.webContents.send('browser-view-title-updated', contents.id, title);
        });

        contents.once('destroyed', () => handleDestroyedBrowserView(contents));

        // Adiciona o WebContents à lista de WebContents com eventos já registrados.
        registeredWebContents.value.add(contents);
    };
};

/**
 * Define os eventos específicos da BrowserView atual.
 * Esses eventos devem ser removidos quando a BrowserView for destruída.
 * 
 * Se um novo evento for adicionado, é preciso adicionar a remoção dele na função `removePreviousViewEvents`.
 * @param view WebContents da BrowserView atual.
 */
function setCurrentViewEvents(view: WebContents, mainWindow: BrowserWindow = getMainWindow()) {
    view.on('did-start-loading', () => {
        mainWindow.webContents.send('current-view-did-start-loading');
    });

    view.on('did-stop-loading', () => {
        mainWindow.webContents.send('current-view-did-stop-loading');
    });

    view.on('did-navigate', () => {
        insertViewCSS(view);
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
function removePreviousViewEvents(view: WebContents) {
    view.removeAllListeners('did-start-loading');
    view.removeAllListeners('did-stop-loading');
    view.removeAllListeners('did-navigate');
    view.removeAllListeners('did-navigate-in-page');
    view.removeAllListeners('did-frame-navigate');
    view.removeAllListeners('did-redirect-navigation');
};

/**
 * Cria uma nova BrowserView.
 * Se a URL não for permitida, a função é interrompida.
 * @param rawUrl URL da nova BrowserView.
 * @returns BrowserView criada ou `null` se algo impedir a criação.
 */
async function createBrowserView(rawUrl: string, mainWindow: BrowserWindow = getMainWindow()) {
    try {
        const browserView = new BrowserView({
            webPreferences: {
                spellcheck: false,
                nodeIntegration: false,
                contextIsolation: true,
                devTools: process.env.ARES_MODE === 'dev',
            }
        });

        // Cria uma instância de URL para verificar se a URL passada à função é válida.
        const url = new URL(rawUrl);
        if (!isAllowedURL(url.href)) return null;

        mainWindow.addBrowserView(browserView);

        const browserViewStore = useBrowserViewStore();
        const { allWebContents } = storeToRefs(browserViewStore);
        allWebContents.value.add(browserView.webContents);
        queueMicrotask(() => setViewSharedEvents(mainWindow));
        
        const contents = browserView.webContents;
        await contents.loadURL(url.href);
        await insertViewCSS(contents);
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

/**
 * Envia à janela principal informações sobre a capacidade de voltar e avançar da BrowserView atual.
 * @param view WebContents da BrowserView atual.
 * @param mainWindow Janela principal.
 */
function updateCurrentViewBackForwardStatus(view: WebContents, mainWindow: BrowserWindow = getMainWindow()) {
    const backForwardStatus = getBackForwardStatus(view);
    mainWindow.webContents.send('current-view-back-forward-status', backForwardStatus);
};

/**
 * Determina o comportamento da aplicação quando uma nova janela for aberta a partir do WebContents.
 * 
 * Uma nova BrowserView será criada se a URL for permitida.
 * @param contents WebContents da BrowserView.
 */
function setWindowOpenHandler(contents: WebContents) {
    contents.setWindowOpenHandler(({ url }) => {
        queueMicrotask(() => createBrowserView(url));
        return { action: 'deny' };
    });
};

function findBrowserViewByWebContentsId(webContentsId: number, mainWindow: BrowserWindow = getMainWindow()) {
    const browserViews = mainWindow.getBrowserViews();
    const browserView = browserViews.find((view) => view.webContents.id === webContentsId);
    if (browserView) return browserView;
    throw new BrowserViewError(`BrowserView não encontrada para o WebContents ${webContentsId}.`);
};

/**
 * Define a BrowserView como ativa e define os eventos de redimensionamento automático.
 * @param view BrowserView a ser definida como ativa.
 * @param currentAutoResize Referência para a função de remoção do evento de redimensionamento automático.
 * @param mainWindow Janela principal.
 */
function setViewAsTopBrowserView(
    view: BrowserView,
    currentAutoResize: MechanusRef<(() => void) | null>,
    mainWindow: BrowserWindow = getMainWindow()
) {
    mainWindow.setTopBrowserView(view);
    setBrowserViewBounds(view);
    currentAutoResize.value = setBrowserViewAutoResize(view);
};

/**
 * Oculta a BrowserView e remove o evento de redimensionamento automático.
 * @param view BrowserView a ser ocultada.
 * @param currentAutoResize Referência para a função de remoção do evento de redimensionamento automático.
 */
function hideBrowserView(view: BrowserView, currentAutoResize: MechanusRef<(() => void) | null>) {
    view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    if (typeof currentAutoResize.value === 'function') {
        currentAutoResize.value();
        currentAutoResize.value = null;
    };
};