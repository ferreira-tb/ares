/* eslint-disable @typescript-eslint/unified-signatures */
import { ipcRenderer } from 'electron';
import type { PlunderAttack } from '$global/objects/plunder';
import type { UnitAmount, World, TribalWarsGameDataType, UserAlias, VillageGroup } from '$types/game';
import type { ErrorLogBase, ErrorLogType, ElectronErrorLogType, OmitOptionalErrorLogProps } from '$types/error';
import type { WorldConfigType, WorldUnitsType, WorldVillagesType } from '$types/world';
import type { ElectronMessageBoxOptions } from '$types/electron';
import type { ConfigModuleRoutes } from '$types/modules';
import type { GeneralConfigType, NotificationsConfigType } from '$types/config';

import type {
    PlunderInfoType,
    CustomPlunderTemplateType,
    DemolitionTemplateType,
    PlunderConfigType,
    PlunderPageListType,
    PlunderGroupType,
    PlunderHistoryType
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
export async function ipcInvoke(channel: 'browser:get-response-time'): Promise<number>;
export async function ipcInvoke(channel: 'is-ignored-app-version', version: string): Promise<boolean>;

// Configurações
export async function ipcInvoke(channel: 'db:clear-database'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-app-general-config'): Promise<GeneralConfigType>;
export async function ipcInvoke(channel: 'get-app-notifications-config'): Promise<NotificationsConfigType>;
export async function ipcInvoke(channel: 'should-reload-after-captcha'): Promise<boolean>;
export async function ipcInvoke(channel: 'should-notify-on-error'): Promise<boolean>;

// Painel
export async function ipcInvoke(channel: 'panel:is-visible'): Promise<boolean>;

// Browser View
export async function ipcInvoke(channel: 'main-view-url'): Promise<string>;
export async function ipcInvoke(channel: 'main-view-web-contents-id'): Promise<number>;
export async function ipcInvoke(channel: 'current-view-url'): Promise<string>;
export async function ipcInvoke(channel: 'current-view-web-contents-id'): Promise<number>;
export async function ipcInvoke(channel: 'current-view-can-go-back'): Promise<boolean>;
export async function ipcInvoke(channel: 'current-view-can-go-forward'): Promise<boolean>;

// World Data
export async function ipcInvoke(channel: 'world-data:get-village', id?: number[] | number, world?: World): Promise<WorldVillagesType[]>;

// Jogo
export async function ipcInvoke(channel: 'current-world'): Promise<World | null>;
export async function ipcInvoke(channel: 'current-world-config'): Promise<WorldConfigType>;
export async function ipcInvoke(channel: 'current-world-units'): Promise<WorldUnitsType>;
export async function ipcInvoke(channel: 'player-name', alias?: UserAlias): Promise<string | null>;
export async function ipcInvoke(channel: 'is-archer-world'): Promise<boolean>;
export async function ipcInvoke(channel: 'fetch-village-groups'): Promise<boolean>;
export async function ipcInvoke(channel: 'get-village-groups'): Promise<Set<VillageGroup>>;

// Erros
export async function ipcInvoke(channel: 'error:get-log'): Promise<ErrorLogType[] | null>;
export async function ipcInvoke(channel: 'error:get-electron-log'): Promise<ElectronErrorLogType[] | null>;

// Plunder
export async function ipcInvoke(channel: 'plunder:is-active'): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:get-config'): Promise<PlunderConfigType | null>;
export async function ipcInvoke(channel: 'plunder:get-history'): Promise<PlunderHistoryType>;
export async function ipcInvoke(channel: 'plunder:get-custom-templates', alias?: UserAlias): Promise<CustomPlunderTemplateType[] | null>;
export async function ipcInvoke(channel: 'plunder:save-custom-template', template: CustomPlunderTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:destroy-custom-template', template: CustomPlunderTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:get-pages-info'): Promise<PlunderPageListType | null>;
export async function ipcInvoke(channel: 'plunder:get-group-info'): Promise<PlunderGroupType | null>;
export async function ipcInvoke(channel: 'plunder:navigate-to-next-page'): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:calc-carry-capacity', units: Partial<UnitAmount>, world?: World): Promise<number | null>;
export async function ipcInvoke(channel: 'plunder:get-demolition-config', alias?: UserAlias): Promise<DemolitionTemplateType | null>;
export async function ipcInvoke(channel: 'plunder:save-demolition-config', template: DemolitionTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:destroy-demolition-config', alias: UserAlias): Promise<boolean>;

// Deimos
export async function ipcInvoke(channel: 'deimos:get-file'): Promise<string | null>;
export async function ipcInvoke(channel: 'deimos:update-plunder-info', plunderInfo: PlunderInfoType): Promise<boolean>;
export async function ipcInvoke(channel: 'deimos:update-current-village-units', units: UnitAmount): Promise<boolean>;

export async function ipcInvoke(channel: string, ...args: any[]): Promise<unknown> {
    const response: unknown = await ipcRenderer.invoke(channel, ...args);
    return response;
};

// Janela
export function ipcSend(channel: 'minimize-main-window'): void;
export function ipcSend(channel: 'close-main-window'): void;

// Geral
export function ipcSend(channel: 'open-any-allowed-website', url: string): void;
export function ipcSend(channel: 'open-ares-website'): void;
export function ipcSend(channel: 'open-github-repo'): void;
export function ipcSend(channel: 'open-github-issues'): void;
export function ipcSend(channel: 'open-app-update-window'): void;
export function ipcSend(channel: 'download-from-url', url: string): void;
export function ipcSend(channel: 'show-update-available-dialog', newVersion: string): void;
export function ipcSend(channel: 'captcha:update-status', status: boolean): void;
export function ipcSend(channel: 'browser:update-response-time', time: number | null): void;
export function ipcSend(channel: 'electron:show-message-box', options: ElectronMessageBoxOptions): void;

// Desenvolvedor
export function ipcSend(channel: 'dev:open-main-window-dev-tools'): void;
export function ipcSend(channel: 'dev:open-panel-window-dev-tools'): void;
export function ipcSend(channel: 'dev:open-current-view-dev-tools'): void;
export function ipcSend(channel: 'dev:open-main-view-dev-tools'): void;

// Configurações
export function ipcSend(channel: 'update-app-general-config', config: GeneralConfigType): void;
export function ipcSend(channel: 'update-app-notifications-config', config: NotificationsConfigType): void;
export function ipcSend(channel: 'open-settings-window', route: ConfigModuleRoutes): void;

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
export function ipcSend(channel: 'error:open-log-window'): void;
export function ipcSend(channel: 'error:create-log', err: OmitOptionalErrorLogProps<ErrorLogBase>): void;

// Plunder
export function ipcSend(channel: 'plunder:open-custom-template-window'): void;
export function ipcSend<T extends keyof PlunderConfigType>(channel: 'plunder:update-config', key: T, value: PlunderConfigType[T]): void;
export function ipcSend(channel: 'plunder:attack-sent', currentVillageId: number | null, plunderAttack: PlunderAttack): void;
export function ipcSend(channel: 'plunder:save-history'): void;
export function ipcSend(channel: 'plunder:show-history'): void;
export function ipcSend(channel: 'plunder:update-pages-info', villageInfo: PlunderPageListType | null): void;
export function ipcSend(channel: 'plunder:update-group-info', groupInfo: PlunderGroupType | null): void;
export function ipcSend(channel: 'plunder:navigate-to-next-village', currentVillageId?: number | null): void;
export function ipcSend(channel: 'plunder:navigate-to-group'): void;
export function ipcSend(channel: 'plunder:navigate-to-first-page'): void;
export function ipcSend(channel: 'plunder:open-demolition-config-window'): void;

// Deimos
export function ipcSend(channel: 'deimos:tag-is-ready'): void;
export function ipcSend(channel: 'deimos:update-game-data', gameData: TribalWarsGameDataType): void;

export function ipcSend(channel: string, ...args: any[]): void {
    ipcRenderer.send(channel, ...args);
};