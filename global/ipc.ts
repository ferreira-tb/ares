import { ipcRenderer } from 'electron';
import type { PlunderState, PlunderStateValue } from '@/plunder.js';
import type { WorldData, UnitData } from '../panel/config.js';
import type { PlunderedResources } from '$/farm/resources.js';
import type { PlunderedAmount } from '@/game.js';
import type { ErrorLog, DOMErrorLog } from '@/error.js';
import type { DeimosEndpoint } from '@/deimos.js';

export async function ipcInvoke(channel: 'app-name'): Promise<string>;
export async function ipcInvoke(channel: 'app-version'): Promise<string>;
export async function ipcInvoke(channel: 'user-data-path'): Promise<string>;
export async function ipcInvoke(channel: 'is-dev'): Promise<boolean>;
export async function ipcInvoke(channel: 'is-deimos-on'): Promise<boolean>;
export async function ipcInvoke(channel: 'deimos-port'): Promise<string>;
export async function ipcInvoke(channel: 'deimos-port', asInt: false): Promise<string>;
export async function ipcInvoke(channel: 'deimos-port', asInt: true): Promise<number>;
export async function ipcInvoke(channel: 'deimos-endpoint'): Promise<DeimosEndpoint>;
export async function ipcInvoke(channel: 'can-predict-plunder', world?: string): Promise<boolean>;
export async function ipcInvoke(channel: 'is-plunder-active', world?: string): Promise<boolean>;
export async function ipcInvoke(channel: 'get-plunder-state', world?: string): Promise<PlunderState | null>;
export async function ipcInvoke(channel: 'get-current-world'): Promise<string | null>;
export async function ipcInvoke(channel: 'has-world-data', world: string): Promise<boolean>;
export async function ipcInvoke(channel: 'has-unit-data', world: string): Promise<boolean>;
export async function ipcInvoke(channel: 'set-world-data', world: string, data: WorldData): Promise<boolean>;
export async function ipcInvoke(channel: 'set-unit-data', world: string, data: UnitData): Promise<boolean>;
export async function ipcInvoke(channel: 'get-last-plundered-amount', world?: string): Promise<PlunderedAmount | null>;
export async function ipcInvoke(channel: 'get-total-plundered-amount', world?: string): Promise<PlunderedAmount | null>;
export async function ipcInvoke(channel: string, ...args: any[]): Promise<unknown> {
    const response = await ipcRenderer.invoke(channel, ...args);
    return response;
};

export function ipcSend(channel: 'log-error', err: ErrorLog): void;
export function ipcSend(channel: 'log-dom-error', err: DOMErrorLog): void;
export function ipcSend(channel: 'reload-main-window'): void;
export function ipcSend(channel: 'force-reload-main-window'): void;
export function ipcSend(channel: 'set-plunder-state', name: keyof PlunderState, value: PlunderStateValue, world?: string): void;
export function ipcSend(channel: 'update-current-coords', x: number, y: number): void;
export function ipcSend(channel: 'update-plundered-amount', resources: PlunderedResources): void;
export function ipcSend(channel: 'save-plundered-amount', resources: PlunderedAmount, world?: string): void;
export function ipcSend(channel: 'add-deimos-report-url', url: string): void;
export function ipcSend(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args);
};