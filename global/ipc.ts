import { ipcRenderer } from 'electron';
import type { PlunderAttack } from '$lib/plunder/attack';
import type { UnitAmount, World, TribalWarsGameDataType, VillageGroup } from '$types/game';
import type { ErrorLogBase, ErrorLogType, DOMErrorLogBase, DOMErrorLogType, MainProcessErrorLogType } from '$types/error';
import type { WorldConfigType, WorldUnitType } from '$types/world';
import type { UserAlias } from '$types/electron';
import type { ConfigModuleRoutes } from '$types/modules';

import type {
    PlunderAttackDetails,
    PlunderInfoType,
    PlunderConfigKeys,
    PlunderConfigValues,
    CustomPlunderTemplateType,
    DemolitionTemplateType,
    PlunderConfigType,
    PlunderCurrentVillageType
} from '$types/plunder';

// Janela
export async function ipcInvoke(channel: 'maximize-or-restore-main-window'): Promise<boolean>;
export async function ipcInvoke(channel: 'is-main-window-minimized'): Promise<boolean>;
export async function ipcInvoke(channel: 'is-main-window-maximized'): Promise<boolean>;

// Geral
export async function ipcInvoke(channel: 'app-name'): Promise<string>;
export async function ipcInvoke(channel: 'app-version'): Promise<string>;
export async function ipcInvoke(channel: 'user-alias'): Promise<UserAlias | null>;
export async function ipcInvoke(channel: 'user-data-path'): Promise<string>;
export async function ipcInvoke(channel: 'user-desktop-path'): Promise<string>;
export async function ipcInvoke(channel: 'is-dev'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-response-time'): Promise<number>;

// Painel
export async function ipcInvoke(channel: 'is-panel-visible'): Promise<boolean>;

// Configurações
export async function ipcInvoke(channel: 'get-demolition-troops-config', alias?: UserAlias): Promise<DemolitionTemplateType | null>;
export async function ipcInvoke(channel: 'save-demolition-troops-config', template: DemolitionTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'destroy-demolition-troops-config', alias: UserAlias): Promise<boolean>;

// Browser View
export async function ipcInvoke(channel: 'main-view-url'): Promise<string>;
export async function ipcInvoke(channel: 'main-view-web-contents-id'): Promise<number>;
export async function ipcInvoke(channel: 'current-view-url'): Promise<string>;
export async function ipcInvoke(channel: 'current-view-web-contents-id'): Promise<number>;
export async function ipcInvoke(channel: 'current-view-can-go-back'): Promise<boolean>;
export async function ipcInvoke(channel: 'current-view-can-go-forward'): Promise<boolean>;

// Jogo
export async function ipcInvoke(channel: 'current-world'): Promise<World | null>;
export async function ipcInvoke(channel: 'current-world-config'): Promise<WorldConfigType>;
export async function ipcInvoke(channel: 'current-world-units'): Promise<WorldUnitType>;
export async function ipcInvoke(channel: 'player-name', alias?: UserAlias): Promise<string | null>;
export async function ipcInvoke(channel: 'is-archer-world'): Promise<boolean>;
export async function ipcInvoke(channel: 'calc-carry-capacity', units: Partial<UnitAmount>, world?: World): Promise<number | null>;
export async function ipcInvoke(channel: 'get-village-groups'): Promise<Set<VillageGroup>>;

// Erros
export async function ipcInvoke(channel: 'get-error-log'): Promise<ErrorLogType[] | null>;
export async function ipcInvoke(channel: 'get-dom-error-log'): Promise<DOMErrorLogType[] | null>;
export async function ipcInvoke(channel: 'get-main-process-error-log'): Promise<MainProcessErrorLogType[] | null>;

// Plunder
export async function ipcInvoke(channel: 'is-plunder-active'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-plunder-config'): Promise<PlunderConfigType | null>;
export async function ipcInvoke(channel: 'get-last-plunder-attack-details'): Promise<PlunderAttackDetails | null>;
export async function ipcInvoke(channel: 'get-total-plunder-attack-details'): Promise<PlunderAttackDetails | null>;
export async function ipcInvoke(channel: 'get-custom-plunder-templates', alias?: UserAlias): Promise<CustomPlunderTemplateType[] | null>;
export async function ipcInvoke(channel: 'save-custom-plunder-template', template: CustomPlunderTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'destroy-custom-plunder-template', template: CustomPlunderTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'navigate-to-next-plunder-page'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-plunder-cache-village-info'): Promise<PlunderCurrentVillageType | null>;

// Deimos
export async function ipcInvoke(channel: 'get-deimos-file'): Promise<string | null>;

export async function ipcInvoke(channel: string, ...args: any[]): Promise<unknown> {
    const response = await ipcRenderer.invoke(channel, ...args);
    return response;
};

/////////////////////////////////////////

// Janela
export function ipcSend(channel: 'minimize-main-window'): void;
export function ipcSend(channel: 'close-main-window'): void;

// Geral
export function ipcSend(channel: 'open-ares-website'): void;
export function ipcSend(channel: 'open-github-repo'): void;
export function ipcSend(channel: 'open-github-issues'): void;
export function ipcSend(channel: 'update-captcha-status', status: boolean): void;
export function ipcSend(channel: 'update-response-time', time: number | null): void;

// Configurações
export function ipcSend(channel: 'open-settings-window', route: ConfigModuleRoutes): void;
export function ipcSend(channel: 'open-demolition-troops-config-window'): void;

// Menu
export function ipcSend(channel: 'open-region-select-menu'): void;
export function ipcSend(channel: 'open-bug-report-menu'): void;

// Browser View
export function ipcSend(channel: 'reload-main-view'): void;
export function ipcSend(channel: 'force-reload-main-view'): void;
export function ipcSend(channel: 'reload-current-view'): void;
export function ipcSend(channel: 'force-reload-current-view'): void;
export function ipcSend(channel: 'current-view-go-home'): void;
export function ipcSend(channel: 'current-view-go-back'): void;
export function ipcSend(channel: 'current-view-go-forward'): void;
export function ipcSend(channel: 'update-current-view', webContentsId: number): void;
export function ipcSend(channel: 'destroy-browser-view', webContentsId: number): void;

// Erros
export function ipcSend(channel: 'open-error-log-window'): void;
export function ipcSend(channel: 'set-error-log', err: ErrorLogBase): void;
export function ipcSend(channel: 'set-dom-error-log', err: DOMErrorLogBase): void;
export function ipcSend(channel: 'delete-error-log', id: number): void;
export function ipcSend(channel: 'delete-dom-error-log', id: number): void;
export function ipcSend(channel: 'delete-main-process-error-log', id: number): void;

// Plunder
export function ipcSend(channel: 'open-custom-plunder-template-window'): void;
export function ipcSend(channel: 'update-plunder-config', key: PlunderConfigKeys, value: PlunderConfigValues): void;
export function ipcSend(channel: 'plunder-attack-sent', plunderAttack: PlunderAttack): void;
export function ipcSend(channel: 'save-plunder-attack-details', details: PlunderAttackDetails): void;
export function ipcSend(channel: 'update-plunder-cache-village-info', villageInfo: PlunderCurrentVillageType | null): void;
export function ipcSend(channel: 'navigate-to-first-plunder-page'): void;

// Deimos
export function ipcSend(channel: 'deimos-tag-is-ready'): void;
export function ipcSend(channel: 'update-game-data', gameData: TribalWarsGameDataType): void;
export function ipcSend(channel: 'update-current-village-units', units: UnitAmount): void;
export function ipcSend(channel: 'update-plunder-info', plunderInfo: PlunderInfoType): void;

export function ipcSend(channel: string, ...args: any[]): void {
    ipcRenderer.send(channel, ...args);
};