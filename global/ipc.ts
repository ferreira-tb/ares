import { ipcRenderer } from 'electron';
import type { PlunderState, PlunderStateValue } from '$types/plunder.js';
import type { WorldData, UnitData } from '$panel/config.js';
import type { PlunderedResources } from '$lib/farm/resources.js';
import type { PlunderedAmount } from '$types/game.js';
import type { ErrorLogBase, ErrorLogType, DOMErrorLogBase, DOMErrorLogType } from '$types/error.js';

// Geral
export async function ipcInvoke(channel: 'app-name'): Promise<string>;
export async function ipcInvoke(channel: 'app-version'): Promise<string>;
export async function ipcInvoke(channel: 'user-data-path'): Promise<string>;
export async function ipcInvoke(channel: 'user-desktop-path'): Promise<string>;
export async function ipcInvoke(channel: 'is-dev'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-deimos-file'): Promise<string | null>;

// Mundo
export async function ipcInvoke(channel: 'has-world-data', world: string): Promise<boolean>;
export async function ipcInvoke(channel: 'has-unit-data', world: string): Promise<boolean>;
export async function ipcInvoke(channel: 'set-world-data', world: string, data: WorldData): Promise<boolean>;
export async function ipcInvoke(channel: 'set-unit-data', world: string, data: UnitData): Promise<boolean>;

// Erros
export async function ipcInvoke(channel: 'get-error-log'): Promise<ErrorLogType[] | null>;
export async function ipcInvoke(channel: 'get-dom-error-log'): Promise<DOMErrorLogType[] | null>;

// Plunder
export async function ipcInvoke(channel: 'is-plunder-active', world?: string): Promise<boolean>;
export async function ipcInvoke(channel: 'get-plunder-state', world?: string): Promise<PlunderState | null>;
export async function ipcInvoke(channel: 'get-last-plundered-amount', world?: string): Promise<PlunderedAmount | null>;
export async function ipcInvoke(channel: 'get-total-plundered-amount', world?: string): Promise<PlunderedAmount | null>;

// Deimos


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

// Plunder
export function ipcSend(channel: 'set-plunder-state', name: keyof PlunderState, value: PlunderStateValue, world?: string): void;
export function ipcSend(channel: 'update-plundered-amount', resources: PlunderedResources): void;
export function ipcSend(channel: 'save-plundered-amount', resources: PlunderedAmount, world?: string): void;

// Deimos
export function ipcSend(channel: 'update-current-world', world: string | null): void;
export function ipcSend(channel: 'update-current-major-version', version: string | null): void;
export function ipcSend(channel: 'update-current-player', playerName: string | null): void;
export function ipcSend(channel: 'update-current-player-id', playerId: number | null): void;
export function ipcSend(channel: 'update-current-player-points', playerPoints: number | null): void;
export function ipcSend(channel: 'update-village-amount', villageAmount: number | null): void;
export function ipcSend(channel: 'update-current-group-id', groupId: number | null): void;
export function ipcSend(channel: 'update-current-coords', x: number | null, y: number | null): void;
export function ipcSend(channel: 'update-premium-status', premium: boolean | null): void;
export function ipcSend(channel: 'update-account-manager-status', accountManager: boolean | null): void;
export function ipcSend(channel: 'update-farm-assistant-status', farmAssistant: boolean | null): void;
export function ipcSend(channel: 'update-current-screen', screen: string | null): void;
export function ipcSend(channel: 'update-screen-mode', screenMode: string | null): void;
export function ipcSend(channel: 'update-pregame-status', pregame: boolean | null): void;
export function ipcSend(channel: 'update-current-village-id', villageId: number | null): void;
export function ipcSend(channel: 'update-current-village-name', villageName: string | null): void;
export function ipcSend(channel: 'update-current-village-population', villagePopulation: number | null): void;
export function ipcSend(channel: 'update-current-village-max-population', villageMaxPopulation: number | null): void;
export function ipcSend(channel: 'update-current-village-points', villagePoints: number | null): void;
export function ipcSend(channel: 'update-current-village-wood', villageWood: number | null): void;
export function ipcSend(channel: 'update-current-village-stone', villageStone: number | null): void;
export function ipcSend(channel: 'update-current-village-iron', villageIron: number | null): void;
export function ipcSend(channel: 'update-current-village-max-storage', villageMaxStorage: number | null): void;

export function ipcSend(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args);
};