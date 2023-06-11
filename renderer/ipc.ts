/* eslint-disable @typescript-eslint/unified-signatures */
import { ipcRenderer } from 'electron';
import type { PlunderAttack } from '$common/templates';

// Janela
export async function ipcInvoke(channel: 'ui:maximize-or-restore'): Promise<boolean>;
export async function ipcInvoke(channel: 'ui:is-minimized'): Promise<boolean>;
export async function ipcInvoke(channel: 'ui:is-maximized'): Promise<boolean>;

// Geral
export async function ipcInvoke(channel: 'user-alias'): Promise<UserAlias | null>;
export async function ipcInvoke(channel: 'is-dev'): Promise<boolean>;

// Aplicação
export async function ipcInvoke(channel: 'app:name'): Promise<string>;
export async function ipcInvoke(channel: 'app:version'): Promise<string>;
export async function ipcInvoke(channel: 'app:locale'): Promise<string>;
export async function ipcInvoke(channel: 'app:user-data-path'): Promise<string>;
export async function ipcInvoke(channel: 'app:desktop-path'): Promise<string>;
export async function ipcInvoke(channel: 'app-update:is-ignored-version', version: string): Promise<boolean>;

// Configurações
export async function ipcInvoke(channel: 'db:clear-database'): Promise<boolean>;
export async function ipcInvoke(channel: 'config:general'): Promise<GeneralConfigType>;
export async function ipcInvoke(channel: 'config:notifications'): Promise<NotificationsConfigType>;
export async function ipcInvoke(channel: 'config:should-reload-after-captcha'): Promise<boolean>;
export async function ipcInvoke(channel: 'config:should-notify-on-error'): Promise<boolean>;

// Browser
export async function ipcInvoke(channel: 'browser:get-response-time'): Promise<number | null>;

// Painel
export async function ipcInvoke(channel: 'panel:is-visible'): Promise<boolean>;

// Browser View
export async function ipcInvoke(channel: 'main-view:url'): Promise<string>;
export async function ipcInvoke(channel: 'main-view:web-contents-id'): Promise<number>;
export async function ipcInvoke(channel: 'current-view:url'): Promise<string>;
export async function ipcInvoke(channel: 'current-view:web-contents-id'): Promise<number>;
export async function ipcInvoke(channel: 'current-view:can-go-back'): Promise<boolean>;
export async function ipcInvoke(channel: 'current-view:can-go-forward'): Promise<boolean>;

// Jogo
export async function ipcInvoke(channel: 'game:fetch-village-groups'): Promise<boolean>;
export async function ipcInvoke(channel: 'game:get-all-village-groups'): Promise<Set<VillageGroup>>;

// Mundo
export async function ipcInvoke(channel: 'world:current'): Promise<World | null>;
export async function ipcInvoke(channel: 'world:get-config', world?: World): Promise<WorldConfigType | null>;
export async function ipcInvoke(channel: 'world:get-units-info', world?: World): Promise<WorldUnitsType | null>;
export async function ipcInvoke(channel: 'world:is-archer-world'): Promise<boolean | null>;
export async function ipcInvoke(
    channel: 'world-data:get-villages', id?: number[] | number, world?: World
): Promise<WorldVillageType[]>;
export async function ipcInvoke(
    channel: 'world-data:get-player-villages', player: number, world?: World
): Promise<WorldVillageType[]>;

// Jogador
export async function ipcInvoke(channel: 'player:name'): Promise<string | null>;
export async function ipcInvoke(channel: 'player:get-store'): Promise<PlayerStore>;

// Erros
export async function ipcInvoke(channel: 'error:export'): Promise<'canceled' | 'error' | 'sucess'>;
export async function ipcInvoke(channel: 'error:get-log'): Promise<ErrorLogType[] | null>;
export async function ipcInvoke(channel: 'error:get-electron-log'): Promise<ElectronErrorLogType[] | null>;

// Plunder
export async function ipcInvoke(channel: 'plunder:is-active'): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:get-config'): Promise<PlunderConfigType | null>;
export async function ipcInvoke(channel: 'plunder:get-history'): Promise<PlunderHistoryType>;
export async function ipcInvoke(
    channel: 'plunder:get-custom-templates', alias?: UserAlias
): Promise<CustomPlunderTemplateType[] | null>;
export async function ipcInvoke(channel: 'plunder:save-custom-template', template: CustomPlunderTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:destroy-custom-template', template: CustomPlunderTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:get-pages-info'): Promise<PlunderPageListType | null>;
export async function ipcInvoke(channel: 'plunder:get-group-info'): Promise<PlunderGroupType | null>;
export async function ipcInvoke(channel: 'plunder:navigate-to-next-page'): Promise<boolean>;
export async function ipcInvoke(
    channel: 'plunder:calc-carry-capacity', units: Partial<UnitAmount>, world?: World
): Promise<number | null>;
export async function ipcInvoke(channel: 'plunder:get-demolition-config', alias?: UserAlias): Promise<DemolitionTemplateType | null>;
export async function ipcInvoke(channel: 'plunder:save-demolition-config', template: DemolitionTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:destroy-demolition-config', alias: UserAlias): Promise<boolean>;

// Academia
export async function ipcInvoke(channel: 'snob:get-config'): Promise<SnobConfigType | null>;
export async function ipcInvoke(channel: 'snob:get-history'): Promise<SnobHistoryType | null>;

// IpcTribal
export async function ipcInvoke(channel: 'ipc-tribal:get-file'): Promise<string | null>;
export async function ipcInvoke(channel: 'ipc-tribal:update-plunder-info', plunderInfo: PlunderInfoType): Promise<boolean>;
export async function ipcInvoke(channel: 'ipc-tribal:update-current-village-units', units: UnitAmount): Promise<boolean>;

export async function ipcInvoke(channel: string, ...args: any[]): Promise<unknown> {
    const response: unknown = await ipcRenderer.invoke(channel, ...args);
    return response;
};

// Janela
export function ipcSend(channel: 'ui:minimize'): void;
export function ipcSend(channel: 'ui:close'): void;

// Geral
export function ipcSend(channel: 'open-any-allowed-website', url: string): void;
export function ipcSend(channel: 'open-ares-website'): void;
export function ipcSend(channel: 'open-github-repo'): void;
export function ipcSend(channel: 'open-github-issues'): void;
export function ipcSend(channel: 'app-update:open'): void;
export function ipcSend(channel: 'download-from-url', url: string): void;
export function ipcSend(channel: 'app-update:update-available-dialog', newVersion: string): void;
export function ipcSend(channel: 'electron:show-message-box', options: ElectronMessageBoxOptions): void;

// Desenvolvedor
export function ipcSend(channel: 'dev:open-main-window-dev-tools'): void;
export function ipcSend(channel: 'dev:open-panel-window-dev-tools'): void;
export function ipcSend(channel: 'dev:open-current-view-dev-tools'): void;
export function ipcSend(channel: 'dev:open-main-view-dev-tools'): void;

// Configurações
export function ipcSend(channel: 'config:open', route: ConfigModuleRoutes): void;
export function ipcSend<T extends keyof AppConfigType>(channel: 'config:update', configType: T, value: AppConfigType[T]): void;

// Menu
export function ipcSend(channel: 'open-region-select-menu'): void;
export function ipcSend(channel: 'open-bug-report-menu'): void;

// Browser
export function ipcSend(channel: 'browser:update-response-time', time: number | null): void;
export function ipcSend(channel: 'captcha:update-status', status: boolean): void;

// Browser View
export function ipcSend(channel: 'main-view:reload'): void;
export function ipcSend(channel: 'main-view:force-reload'): void;
export function ipcSend(channel: 'current-view:reload'): void;
export function ipcSend(channel: 'current-view:force-reload'): void;
export function ipcSend(channel: 'current-view:home'): void;
export function ipcSend(channel: 'current-view:back'): void;
export function ipcSend(channel: 'current-view:forward'): void;
export function ipcSend(channel: 'current-view:update', webContentsId: number): void;
export function ipcSend(channel: 'current-view:navigate-to-place', villageId: number): void;
export function ipcSend(channel: 'current-view:navigate-to-snob-train', villageId: number): void;
export function ipcSend(channel: 'current-view:navigate-to-snob-coin', villageId: number, groupId?: number): void;
export function ipcSend(channel: 'view:destroy', webContentsId: number): void;

// Erros
export function ipcSend(channel: 'error:open-log-window'): void;
export function ipcSend(channel: 'error:create-log', err: OmitOptionalErrorLogProps<ErrorLogBase>): void;

// Jogo
export function ipcSend(channel: 'game:update-incomings-amount', incomingAttacks: number | null): void;
export function ipcSend(channel: 'game:update-incomings-info', incomingAttacks: IncomingAttack[]): void;

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

// Academia
export function ipcSend(channel: 'snob:update-config', config: SnobConfigType): void;

// IpcTribal
export function ipcSend(channel: 'ipc-tribal:tag-is-ready'): void;
export function ipcSend(channel: 'ipc-tribal:update-game-data', gameData: TribalWarsGameDataType): void;

// Tribal Worker
export function ipcSend(channel: 'tribal-worker:will-handle-incoming-attack'): void;
export function ipcSend(channel: 'tribal-worker:did-handle-incoming-attack'): void;
export function ipcSend(channel: 'tribal-worker:did-fail-to-handle-incoming-attack'): void;
export function ipcSend(
    channel: 'tribal-worker:no-coin-to-mint', alias: UserAlias, config: SnobConfigType, history: SnobHistoryType
): void;
export function ipcSend(
    channel: 'tribal-worker:coin-minted', alias: UserAlias, config: SnobConfigType, history: SnobHistoryType
): void;
export function ipcSend(
    channel: 'tribal-worker:did-fail-to-mint-coin', alias: UserAlias, config: SnobConfigType, history: SnobHistoryType | null
): void;

export function ipcSend(channel: string, ...args: any[]): void {
    ipcRenderer.send(channel, ...args);
};