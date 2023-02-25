import { ipcRenderer } from 'electron';
import type { PlunderConfigType } from '$types/plunder.js';
import type { PlunderAttack } from '$lib/plunder/attack.js';
import type { UnitAmount, World, TribalWarsGameDataType, UnitsToDestroyWall } from '$types/game.js';
import type { PlunderAttackDetails, PlunderInfoType, PlunderConfigKeys, PlunderConfigValues } from '$types/plunder.js';
import type { ErrorLogBase, ErrorLogType, DOMErrorLogBase, DOMErrorLogType, MainProcessErrorLogType } from '$types/error.js';
import type { WorldConfigType, WorldUnitType } from '$types/world.js';
import type { UserAlias } from '$types/electron.js';

// Geral
export async function ipcInvoke(channel: 'app-name'): Promise<string>;
export async function ipcInvoke(channel: 'app-version'): Promise<string>;
export async function ipcInvoke(channel: 'user-alias'): Promise<UserAlias | null>;
export async function ipcInvoke(channel: 'user-data-path'): Promise<string>;
export async function ipcInvoke(channel: 'user-desktop-path'): Promise<string>;
export async function ipcInvoke(channel: 'is-dev'): Promise<boolean>;

// Jogo
export async function ipcInvoke(channel: 'current-world'): Promise<World | null>;
export async function ipcInvoke(channel: 'current-world-config'): Promise<WorldConfigType>;
export async function ipcInvoke(channel: 'current-world-units'): Promise<WorldUnitType>;
export async function ipcInvoke(channel: 'is-archer-world'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-demolition-troops-config'): Promise<UnitsToDestroyWall | null>;
export async function ipcInvoke(channel: 'destroy-demolition-troops-config', alias: UserAlias): Promise<boolean>;

// Erros
export async function ipcInvoke(channel: 'get-error-log'): Promise<ErrorLogType[] | null>;
export async function ipcInvoke(channel: 'get-dom-error-log'): Promise<DOMErrorLogType[] | null>;
export async function ipcInvoke(channel: 'get-main-process-error-log'): Promise<MainProcessErrorLogType[] | null>;

// Plunder
export async function ipcInvoke(channel: 'is-plunder-active'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-plunder-config'): Promise<PlunderConfigType | null>;
export async function ipcInvoke(channel: 'get-last-plunder-attack-details'): Promise<PlunderAttackDetails | null>;
export async function ipcInvoke(channel: 'get-total-plunder-attack-details'): Promise<PlunderAttackDetails | null>;

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
export function ipcSend(channel: 'open-ares-website'): void;

// Configurações
export function ipcSend(channel: 'open-plunder-config-window'): void;
export function ipcSend(channel: 'open-demolition-troops-config-window'): void;
export function ipcSend(channel: 'save-demolition-troops-config', alias: UserAlias, units: UnitsToDestroyWall): void;

// Erros
export function ipcSend(channel: 'open-error-log-window'): void;
export function ipcSend(channel: 'set-error-log', err: ErrorLogBase): void;
export function ipcSend(channel: 'set-dom-error-log', err: DOMErrorLogBase): void;
export function ipcSend(channel: 'delete-error-log', id: number): void;
export function ipcSend(channel: 'delete-dom-error-log', id: number): void;
export function ipcSend(channel: 'delete-main-process-error-log', id: number): void;

// Plunder
export function ipcSend(channel: 'update-plunder-config', key: PlunderConfigKeys, value: PlunderConfigValues): void;
export function ipcSend(channel: 'plunder-attack-sent', plunderAttack: PlunderAttack): void;
export function ipcSend(channel: 'save-plunder-attack-details', details: PlunderAttackDetails): void;

// Deimos
export function ipcSend(channel: 'script-tag-is-ready'): void;
export function ipcSend(channel: 'update-game-data', gameData: TribalWarsGameDataType): void;
export function ipcSend(channel: 'update-current-village-units', units: UnitAmount): void;
export function ipcSend(channel: 'update-plunder-info', plunderInfo: PlunderInfoType): void;

export function ipcSend(channel: string, ...args: any[]): void {
    ipcRenderer.send(channel, ...args);
};