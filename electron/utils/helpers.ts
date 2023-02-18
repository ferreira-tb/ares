import { URL } from 'url';
import { BrowserWindow } from 'electron';
import { assertInstanceOf, assertString, assert } from '@tb-dev/ts-guard';
import type { UserAlias } from '$types/electron.js';

export const getMainWindow = () => {
    const id = Number.parseIntStrict(process.env.MAIN_WINDOW_ID ?? '', 10);
    return BrowserWindow.fromId(id);
};

export const assertMainWindow = () => {
    const mainWindow = getMainWindow();
    assertInstanceOf(mainWindow, BrowserWindow, 'Não foi possível obter a janela do browser.');
    return mainWindow;
};

export const getPanelWindow = () => {
    const id = Number.parseIntStrict(process.env.PANEL_WINDOW_ID ?? '', 10);
    return BrowserWindow.fromId(id);
};

export const assertPanelWindow = () => {
    const panelWindow = getPanelWindow();
    assertInstanceOf(panelWindow, BrowserWindow, 'Não foi possível obter a janela do painel.');
    return panelWindow;
};

export function getWorldFromURL(url: URL) {
    const index = url.hostname.indexOf('.tribalwars');
    if (index === -1) return null;
    
    let world = url.hostname.slice(0, index);
    world = world.replace(/www\.?/g, '');
    
    if (world.length < 1) return null;
    return world;
};

export function assertWorldFromURL(url: URL) {
    const world = getWorldFromURL(url);
    assertString(world, 'Não foi possível determinar o mundo a partir da URL.');
    return world;
};

export function togglePanelWindow() {
    const mainWindow = assertMainWindow();
    const panelWindow = assertPanelWindow();

    if (panelWindow.isVisible()) {
        panelWindow.hide();

        if (mainWindow.isVisible() && !mainWindow.isFocused()) {
            mainWindow.focus();
        };

    } else {
        panelWindow.show();
    };
};

export function validateUserAlias(alias: unknown): alias is UserAlias {
    assertString(alias, 'O alias não é uma string.');
    return /^[a-z]+\d+__USERID__\d+$/.test(alias);
};

export function validateUserAliasStrict(alias: unknown): alias is UserAlias {
    const result = validateUserAlias(alias);
    assert(result === true, 'O alias não é válido.');
    return result;
};