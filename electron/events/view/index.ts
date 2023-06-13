import { URL } from 'node:url';
import { ipcMain, BrowserView } from 'electron';
import { computed, storeToRefs, watch } from 'mechanus';
import { useBrowserViewStore, useCacheStore } from '$electron/stores';
import { isAllowedOrigin } from '$common/guards';
import { getMainWindow } from '$electron/utils/helpers';
import { BrowserViewError } from '$electron/error';
import { removePreviousViewEvents, setCurrentViewEvents } from '$electron/events/view/current-view';
import { setCurrentViewNavigationEvents } from '$electron/events/view/navigation';

import {
    insertViewCSS,
    setBrowserViewBounds,
    setBrowserViewAutoResize,
    getMainViewWebContents,
    contentsGoBack,
    contentsGoForward,
    contentsGoHome
} from '$electron/utils/view';

export function setBrowserViewEvents() {
    const mainWindow = getMainWindow();
    const cacheStore = useCacheStore();
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
    ipcMain.handle('main-view:web-contents-id', () => mainViewWebContents.id);
    ipcMain.handle('main-view:url', () => mainViewWebContents.getURL());
    ipcMain.on('main-view:reload', () => mainViewWebContents.reload());
    ipcMain.on('main-view:force-reload', () => mainViewWebContents.reloadIgnoringCache());

    // View atual.
    ipcMain.on('current-view:update', (_e, webContentsId: number) => {
        try {
            const view = findBrowserViewByWebContentsId(webContentsId, mainWindow);
            currentWebContents.value = view.webContents;
        } catch (err) {
            BrowserViewError.catch(err);
        };
    });

    // Os eventos abaixo estão relacionados à BrowserView atual.
    // No entanto, não precisam ser definidos separadamente, pois são obtidos dinamicamente dentro da callback.
    ipcMain.handle('current-view:url', () => currentView.value.webContents.getURL());
    ipcMain.handle('current-view:web-contents-id', () => currentView.value.webContents.id);
    ipcMain.handle('current-view:can-go-back', () => currentView.value.webContents.canGoBack());
    ipcMain.handle('current-view:can-go-forward', () => currentView.value.webContents.canGoForward());

    ipcMain.on('current-view:reload', () => currentView.value.webContents.reload());
    ipcMain.on('current-view:force-reload', () => currentView.value.webContents.reloadIgnoringCache());
    ipcMain.on('current-view:home', () => contentsGoHome(currentView.value.webContents, cacheStore.region));
    ipcMain.on('current-view:back', () => contentsGoBack(currentView.value.webContents));
    ipcMain.on('current-view:forward', () => contentsGoForward(currentView.value.webContents));

    // BrowserViews específicas.
    ipcMain.on('view:destroy', (_e, webContentsId: number) => {
        try {
            const view = findBrowserViewByWebContentsId(webContentsId, mainWindow);
            destroyBrowserView(view, mainWindow, mainViewWebContents);
        } catch (err) {
            BrowserViewError.catch(err);
        };
    });

    // Define os eventos compartilhados entre todas as BrowserViews.
    setViewSharedEvents(mainWindow, mainViewWebContents);

    // Define os eventos específicos da BrowserView atual.
    setCurrentViewEvents(currentView.value.webContents);
    setCurrentViewNavigationEvents(currentView);

    watch(currentView, (newView, oldView) => {
        // Remove os eventos da BrowserView anterior e define os eventos da nova BrowserView.
        removePreviousViewEvents(oldView.webContents);
        setCurrentViewEvents(newView.webContents);

        // Atualiza as dimensões de ambas as BrowserViews.
        setViewAsTopBrowserView(newView, currentAutoResize, mainWindow);
        hideBrowserView(oldView, currentAutoResize, mainWindow);
    });
};

/**
 * Define os eventos compartilhados entre todas as BrowserViews.
 * Esses eventos devem ser removidos quando a BrowserView for destruída.
 */
function setViewSharedEvents(
    mainWindow: Electron.BrowserWindow = getMainWindow(),
    mainViewWebContents: Electron.WebContents = getMainViewWebContents()
) {
    const browserViewStore = useBrowserViewStore();
    const { allWebContents, registeredWebContents } = storeToRefs(browserViewStore);

    for (const contents of allWebContents.value) {
        // Verifica se os eventos já foram definidos.
        if (registeredWebContents.value.has(contents)) continue;

        // Impede que o usuário navegue para fora da página do jogo.
        contents.on('will-navigate', (e, url) => {
            if (!isAllowedOrigin(url)) e.preventDefault();
        });

        contents.on('page-title-updated', () => {
            if (contents === mainViewWebContents) return;
            const title = contents.getTitle();
            mainWindow.webContents.send('browser-view-title-updated', contents.id, title);
        });

        // Adiciona o WebContents à lista de WebContents com eventos já registrados.
        registeredWebContents.value.add(contents);
    };
};

/**
 * Cria uma nova BrowserView.
 * Se a URL não for permitida, a função é interrompida.
 * @param rawUrl URL da nova BrowserView.
 * @returns BrowserView criada ou `null` se algo impedir a criação.
 */
async function createBrowserView(rawUrl: string, mainWindow: Electron.BrowserWindow = getMainWindow()) {
    try {
        mainWindow.webContents.send('browser-view-will-be-created');
        const browserView = new BrowserView({
            webPreferences: {
                spellcheck: false,
                nodeIntegration: false,
                contextIsolation: true,
                devTools: process.env.ARES_MODE === 'dev'
            }
        });

        // Cria uma instância de URL para verificar se a URL passada à função é válida.
        const url = new URL(rawUrl);
        if (!isAllowedOrigin(url.href)) return null;

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
        mainWindow.webContents.send('browser-view-did-fail-to-create');
        BrowserViewError.catch(err);
        return null;
    };
};

function destroyBrowserView(
    view: BrowserView,
    mainWindow: Electron.BrowserWindow = getMainWindow(),
    mainViewWebContents: Electron.WebContents = getMainViewWebContents()
) {
    try {
        const browserViewStore = useBrowserViewStore();
        const { allWebContents, registeredWebContents } = storeToRefs(browserViewStore);

        // Verifica se o WebContents é o da BrowserView principal.
        // Se for, os eventos não devem ser removidos.
        const contents = view.webContents;
        if (contents === mainViewWebContents) return;

        mainWindow.webContents.send('browser-view-will-be-destroyed');

        queueMicrotask(() => {
            contents.removeAllListeners();
            registeredWebContents.value.delete(contents);
            allWebContents.value.delete(contents);
            mainWindow.removeBrowserView(view);
        });
        
        // Notifica a janela principal que a BrowserView foi destruída.
        mainWindow.webContents.send('browser-view-destroyed', contents.id);

    } catch (err) {
        mainWindow.webContents.send('browser-view-did-fail-to-destroy');
        BrowserViewError.catch(err);
    };
};

/**
 * Determina o comportamento da aplicação quando uma nova janela for aberta a partir do WebContents.
 * 
 * Uma nova BrowserView será criada se a URL for permitida.
 * @param contents WebContents da BrowserView.
 */
function setWindowOpenHandler(contents: Electron.WebContents) {
    contents.setWindowOpenHandler(({ url }) => {
        queueMicrotask(() => createBrowserView(url));
        return { action: 'deny' };
    });
};

function findBrowserViewByWebContentsId(
    webContentsId: number, mainWindow: Electron.BrowserWindow = getMainWindow()
): Electron.BrowserView {
    const browserViews = mainWindow.getBrowserViews();
    const browserView = browserViews.find((view) => view.webContents.id === webContentsId);
    if (browserView) return browserView;
    throw new BrowserViewError(`Could not find BrowserView with WebContents ID ${webContentsId}`);
};

/**
 * Define a BrowserView como ativa e define os eventos de redimensionamento automático.
 * @param view BrowserView a ser definida como ativa.
 * @param currentAutoResize Referência para a função de remoção do evento de redimensionamento automático.
 * @param mainWindow Janela principal.
 */
function setViewAsTopBrowserView(
    view: Electron.BrowserView,
    currentAutoResize: MechanusRef<(() => void) | null>,
    mainWindow: Electron.BrowserWindow = getMainWindow()
): void {
    mainWindow.webContents.send('browser-view-will-be-set-as-top', view.webContents.id);
    mainWindow.setTopBrowserView(view);
    setBrowserViewBounds(view);
    currentAutoResize.value = setBrowserViewAutoResize(view);
    mainWindow.webContents.send('browser-view-was-set-as-top', view.webContents.id);
};

/**
 * Oculta a BrowserView e remove o evento de redimensionamento automático.
 * @param view BrowserView a ser ocultada.
 * @param currentAutoResize Referência para a função de remoção do evento de redimensionamento automático.
 * @param mainWindow Janela principal.
 */
function hideBrowserView(
    view: Electron.BrowserView,
    currentAutoResize: MechanusRef<(() => void) | null>,
    mainWindow: Electron.BrowserWindow = getMainWindow()
): void {
    mainWindow.webContents.send('browser-view-will-be-hidden', view.webContents.id);
    view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    if (typeof currentAutoResize.value === 'function') {
        currentAutoResize.value();
        currentAutoResize.value = null;
    };

    mainWindow.webContents.send('browser-view-was-hidden', view.webContents.id);
};