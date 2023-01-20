import { ipcRenderer } from 'electron';
import type { PlunderState, PlunderStateValue } from '@/stores/plunder.js';
import type { WorldData, UnitData } from '@/api/config.js';

export async function ipcInvoke(channel: 'app-name'): Promise<string>;
export async function ipcInvoke(channel: 'app-version'): Promise<string>;
export async function ipcInvoke(channel: 'is-plunder-active'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-plunder-state'): Promise<PlunderState | null>;
export async function ipcInvoke(channel: 'get-current-world'): Promise<string | null>;
export async function ipcInvoke(channel: 'has-world-data', world: string): Promise<boolean>;
export async function ipcInvoke(channel: 'has-unit-data', world: string): Promise<boolean>;
export async function ipcInvoke(channel: 'set-world-data', world: string, data: WorldData): Promise<boolean>;
export async function ipcInvoke(channel: 'set-unit-data', world: string, data: UnitData): Promise<boolean>;
export async function ipcInvoke(channel: string, ...args: any[]): Promise<unknown> {
    const response = await ipcRenderer.invoke(channel, ...args);
    return response;
};

export function ipcSend(channel: 'set-plunder-state', name: keyof PlunderState, value: PlunderStateValue): void;
export function ipcSend(channel: 'update-current-coords', x: number, y: number): void;
export function ipcSend(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args);
};