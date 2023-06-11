import { app, BrowserWindow } from 'electron';
import { assertWorld } from '$common/guards';
import { MainProcessError } from '$electron/error';
import { appConfig } from '$electron/stores/config';

export function restartAres() {
    app.relaunch();
    app.quit();
};

export function getMainWindow(): BrowserWindow {
    const id = Number.parseIntStrict(process.env.MAIN_WINDOW_ID ?? '');
    const mainWindow = BrowserWindow.fromId(id);
    if (!(mainWindow instanceof BrowserWindow)) {
        throw new MainProcessError('Could not get main window.');
    };
    return mainWindow;
};

export function getPanelWindow(): BrowserWindow {
    const id = Number.parseIntStrict(process.env.PANEL_WINDOW_ID ?? '');
    const panelWindow = BrowserWindow.fromId(id);
    if (!(panelWindow instanceof BrowserWindow)) {
        throw new MainProcessError('Could not get panel window.');
    };
    return panelWindow;
};

/** Exibe ou oculta a janela do painel. */
export function togglePanelWindow(): void {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();

    if (panelWindow.isVisible()) {
        panelWindow.hide();

        if (mainWindow.isVisible() && !mainWindow.isFocused()) {
            mainWindow.focus();
        };

    } else {
        panelWindow.show();
    };

    panelWindow.webContents.send('panel:visibility-did-change', panelWindow.isVisible());
    appConfig.set('panel', { show: panelWindow.isVisible() });
};

/**
 * Maximiza ou restaura a janela, dependendo do estado atual.
 * @param window Janela a ser maximizada ou restaurada.
 * @returns Booleano indicando se a janela está maximizada.
 */
export function maximizeOrRestoreWindow(window: BrowserWindow): boolean {
    if (window.isMaximized()) {
        window.restore();
    } else {
        window.maximize();
    };

    return window.isMaximized();
};

/**
* Retorna o alias do usuário, no padrão `/^[a-z]+\d+_{ nome do jogador }/`.

* Ele é usado para diferenciar tanto diferentes jogadores quanto diferentes mundos do mesmo jogador.
* @param playerName Nome do jogador.
*/
export function generateUserAlias(world: World, playerName: string): UserAlias {
    playerName = encodeURIComponent(playerName);
    assertWorld(world, MainProcessError);
    return `${world}_${playerName}`;
};