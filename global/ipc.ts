import { ipcRenderer } from 'electron';
import type { PlunderConfigType } from '$types/plunder.js';
import type { PlunderedResources } from '$lib/plunder/resources.js';
import type { UnitAmount } from '$types/game.js';
import type { PlunderedAmount } from '$types/plunder.js';
import type { ErrorLogBase, ErrorLogType, DOMErrorLogBase, DOMErrorLogType, MainProcessErrorLogType } from '$types/error.js';
import type { TribalWarsGameData } from '$deimos/models/data.js';
import type { PlunderInfo } from '$deimos/models/plunder.js';
import type { UserAlias } from '$types/electron.js';

// Geral
export async function ipcInvoke(channel: 'app-name'): Promise<string>;
export async function ipcInvoke(channel: 'app-version'): Promise<string>;
export async function ipcInvoke(channel: 'user-alias'): Promise<UserAlias | null>;
export async function ipcInvoke(channel: 'user-data-path'): Promise<string>;
export async function ipcInvoke(channel: 'user-desktop-path'): Promise<string>;
export async function ipcInvoke(channel: 'is-dev'): Promise<boolean>;

// Erros
export async function ipcInvoke(channel: 'get-error-log'): Promise<ErrorLogType[] | null>;
export async function ipcInvoke(channel: 'get-dom-error-log'): Promise<DOMErrorLogType[] | null>;
export async function ipcInvoke(channel: 'get-main-process-error-log'): Promise<MainProcessErrorLogType[] | null>;

// Plunder
export async function ipcInvoke(channel: 'is-plunder-active'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-plunder-config', world?: string): Promise<PlunderConfigType | null>;
export async function ipcInvoke(channel: 'get-last-plundered-amount'): Promise<PlunderedAmount | null>;
export async function ipcInvoke(channel: 'get-total-plundered-amount'): Promise<PlunderedAmount | null>;

// Deimos
export async function ipcInvoke(channel: 'get-deimos-file'): Promise<string | null>;

export async function ipcInvoke(channel: string, ...args: any[]): Promise<unknown> {
    const response = await ipcRenderer.invoke(channel, ...args);
    return response;
};

/////////////////////////////////////////

// Geral
export function ipcSend(channel: 'reload-browser-window'): void;
export function ipcSend(channel: 'force-reload-browser-window'): void;

// Erros
export function ipcSend(channel: 'set-error-log', err: ErrorLogBase): void;
export function ipcSend(channel: 'set-dom-error-log', err: DOMErrorLogBase): void;
export function ipcSend(channel: 'delete-error-log', id: number): void;
export function ipcSend(channel: 'delete-dom-error-log', id: number): void;
export function ipcSend(channel: 'delete-main-process-error-log', id: number): void;

// Plunder
export function ipcSend(channel: 'update-plunder-config', plunderConfig: PlunderConfigType): void;
export function ipcSend(channel: 'update-plundered-amount', resources: PlunderedResources): void;
export function ipcSend(channel: 'save-plundered-amount', resources: PlunderedAmount): void;

// Deimos
export function ipcSend(channel: 'script-tag-is-ready'): void;
export function ipcSend(channel: 'update-game-data', gameData: TribalWarsGameData): void;
export function ipcSend(channel: 'update-current-village-units', units: UnitAmount): void;
export function ipcSend(channel: 'update-plunder-info', plunderInfo: PlunderInfo): void;

export function ipcSend(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args);
};