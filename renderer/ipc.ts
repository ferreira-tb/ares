/* eslint-disable @typescript-eslint/unified-signatures */
import { ipcRenderer } from 'electron';
import type { RendererWorkerName, StandardWindowName, WebsiteUrl } from '$common/enum';
import type { PlunderAttack } from '$common/templates';

const debug = {
    enabled: false
};

ipcRenderer.invoke('debug:is-enabled').then((isEnabled: boolean) => {
    debug.enabled = isEnabled;
});

ipcRenderer.on('debug:did-update-status', (_e, isEnabled: boolean) => {
    debug.enabled = isEnabled;
});

function report(processType: 'main' | 'renderer', channel: string, ...args: unknown[]): void {
    ipcRenderer.send('debug:report', processType, channel, ...args);
}

// Aplicação
export async function ipcInvoke(channel: 'app:name'): Promise<string>;
export async function ipcInvoke(channel: 'app:version'): Promise<string>;
export async function ipcInvoke(channel: 'app:locale'): Promise<string>;
export async function ipcInvoke(channel: 'app:is-dev'): Promise<boolean>;
export async function ipcInvoke(channel: 'app:user-data-path'): Promise<string>;
export async function ipcInvoke(channel: 'app:desktop-path'): Promise<string>;
export async function ipcInvoke(channel: 'app-update:is-ignored-version', version: string): Promise<boolean>;

// Geral
export async function ipcInvoke(channel: 'user:get-alias'): Promise<UserAlias | null>;

// Desenvolvedor
export async function ipcInvoke(channel: 'debug:is-enabled'): Promise<boolean>;

// Janela
export async function ipcInvoke(channel: 'ui:is-maximized'): Promise<boolean>;

// Configurações
export async function ipcInvoke(channel: 'db:clear-database'): Promise<boolean>;
export async function ipcInvoke<T extends keyof AppConfigType>(
    channel: 'config:get', configType: T
): Promise<AppConfigType[T]>;
export async function ipcInvoke(channel: 'config:should-reload-after-captcha'): Promise<boolean>;
export async function ipcInvoke(channel: 'config:should-notify-on-error'): Promise<boolean>;

// Browser
export async function ipcInvoke(channel: 'browser:get-response-time'): Promise<number | null>;

// Abas
export async function ipcInvoke(channel: 'tab:title', tabId: number): Promise<string | null>;
export async function ipcInvoke(channel: 'main-tab:url'): Promise<string>;
export async function ipcInvoke(channel: 'main-tab:id'): Promise<number>;
export async function ipcInvoke(channel: 'current-tab:url'): Promise<string>;
export async function ipcInvoke(channel: 'current-tab:id'): Promise<number>;
export async function ipcInvoke(channel: 'current-tab:can-go-back'): Promise<boolean>;
export async function ipcInvoke(channel: 'current-tab:can-go-forward'): Promise<boolean>;

// Jogo
export async function ipcInvoke(channel: 'game:add-villages-to-group', group: number, villages: number[]): Promise<boolean>;
export async function ipcInvoke(
    channel: 'game:count-troops', group?: number
): Promise<Map<number, TroopsCounterResultType> | null>;
export async function ipcInvoke(channel: 'game:create-static-group', groupName: string): Promise<VillageGroup | null>;
export async function ipcInvoke(channel: 'game:data'): Promise<TribalWarsGameDataType | null>;
export async function ipcInvoke(channel: 'game:fetch-diplomacy'): Promise<RawDiplomacy | null>;
export async function ipcInvoke(channel: 'game:fetch-village-groups'): Promise<boolean>;
export async function ipcInvoke(channel: 'game:get-all-village-groups'): Promise<VillageGroup[]>;

// Mundo
export async function ipcInvoke(channel: 'world:current'): Promise<World | null>;
export async function ipcInvoke(channel: 'world:get-config', world?: World): Promise<WorldConfigType | null>;
export async function ipcInvoke(channel: 'world:get-units-info', world?: World): Promise<WorldUnitsType | null>;
export async function ipcInvoke(
    channel: 'world-data:get-ally', id?: number | number[] | null, world?: World | null
): Promise<WorldAllyType[]>;
export async function ipcInvoke(
    channel: 'world-data:get-ally-players', id: number | number[], world?: World
): Promise<WorldPlayerType[]>;
export async function ipcInvoke(
    channel: 'world-data:get-ally-villages', id: number | number[], world?: World
): Promise<WorldVillageType[]>;
export async function ipcInvoke(
    channel: 'world-data:get-player-villages', player: number | number[], world?: World
): Promise<WorldVillageType[]>;
export async function ipcInvoke(
    channel: 'world-data:get-village', id?: number | number[] | null, world?: World | null
): Promise<WorldVillageType[]>;
export async function ipcInvoke(channel: 'world:is-archer-world'): Promise<boolean | null>;

// Jogador
export async function ipcInvoke(channel: 'player:name'): Promise<string | null>;

// Erros
export async function ipcInvoke(channel: 'error:export'): Promise<'canceled' | 'error' | 'sucess'>;
export async function ipcInvoke(channel: 'error:get-log'): Promise<ErrorLogType[] | null>;
export async function ipcInvoke(channel: 'error:get-electron-log'): Promise<ElectronErrorLogType[] | null>;

// Plunder
export async function ipcInvoke(channel: 'plunder:is-active'): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:get-config'): Promise<PlunderConfigType | null>;
export async function ipcInvoke(channel: 'plunder:get-history', omitVillages?: boolean): Promise<PlunderHistoryType>;
export async function ipcInvoke(
    channel: 'plunder:get-custom-templates', alias?: UserAlias
): Promise<PlunderCustomTemplateType[] | null>;
export async function ipcInvoke(channel: 'plunder:save-custom-template', template: PlunderCustomTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:destroy-custom-template', template: PlunderCustomTemplateType): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:get-pages-info'): Promise<PlunderPageListType | null>;
export async function ipcInvoke(channel: 'plunder:get-group-info'): Promise<PlunderGroupType | null>;
export async function ipcInvoke(channel: 'plunder:navigate-to-next-page'): Promise<boolean>;
export async function ipcInvoke(
    channel: 'plunder:calc-carry-capacity', units: Partial<UnitAmount>, world?: World
): Promise<number | null>;
export async function ipcInvoke(
    channel: 'plunder:default-demolition-template', alias?: UserAlias | null
): Promise<PlunderDemolitionTemplateType>;
export async function ipcInvoke(channel: 'plunder:delete-demolition-template', id: number): Promise<boolean>;
export async function ipcInvoke(channel: 'plunder:get-demolition-template', id: number): Promise<PlunderDemolitionTemplateType | null>;
export async function ipcInvoke(
    channel: 'plunder:get-demolition-templates-by-alias', alias?: UserAlias | null
): Promise<PlunderDemolitionTemplateType[] | null>;
export async function ipcInvoke(
    channel: 'plunder:save-demolition-template', template: PartialKeys<PlunderDemolitionTemplateType, 'id'>
): Promise<boolean>;

// Academia
export async function ipcInvoke(channel: 'snob:get-config'): Promise<SnobConfigType | null>;
export async function ipcInvoke(channel: 'snob:get-history'): Promise<SnobHistoryType | null>;

// IpcTribal
export async function ipcInvoke(channel: 'ipc-tribal:get-file'): Promise<string | null>;
export async function ipcInvoke(channel: 'ipc-tribal:update-plunder-info', plunderInfo: PlunderInfoType): Promise<boolean>;
export async function ipcInvoke(channel: 'ipc-tribal:update-current-village-units', units: UnitAmount): Promise<boolean>;

// Renderer Worker
export async function ipcInvoke(
    channel: 'renderer-worker:get-js-file', workerName: RendererWorkerName
): Promise<string | null>;

export async function ipcInvoke(channel: string, ...args: any[]): Promise<unknown> {
    if (debug.enabled) report('renderer', channel, ...args);
    const response: unknown = await ipcRenderer.invoke(channel, ...args);
    return response;
}

// Aplicação
export function ipcSend(channel: 'app:relaunch'): void;

// Geral
export function ipcSend(channel: 'download-from-url', url: string): void;
export function ipcSend(channel: 'electron:show-message-box', options: MessageBoxOptions): void;
export function ipcSend(channel: 'website:any', url: string): void;
export function ipcSend(channel: 'website:open', url: WebsiteUrl): void;
export function ipcSend(channel: 'window:open', route: StandardWindowName): void;
export function ipcSend(channel: 'window:show-context-menu', options: ContextMenuOptions): void;
export function ipcSend(channel: 'update:update-available-dialog', newVersion: string): void;

// Desenvolvedor
export function ipcSend(channel: 'debug:toggle', status: boolean): void;
export function ipcSend(channel: 'debug:show-context-menu', isOptionsVisible: boolean): void;
export function ipcSend(channel: 'dev:magic'): void;
export function ipcSend(channel: 'dev-tools:main-window'): void;
export function ipcSend(channel: 'dev-tools:current-tab'): void;
export function ipcSend(channel: 'dev-tools:main-tab'): void;

// Janela
export function ipcSend(channel: 'ui:minimize'): void;
export function ipcSend(channel: 'ui:maximize'): void;
export function ipcSend(channel: 'ui:close'): void;

// Configurações
export function ipcSend<T extends keyof AppConfigType>(channel: 'config:update', configType: T, value: AppConfigType[T]): void;

// Menu
export function ipcSend(channel: 'menu:bug'): void;

// Browser
export function ipcSend(channel: 'browser:show-context-menu', options: ContextMenuOptions): void;
export function ipcSend(channel: 'browser:update-response-time', time: number | null): void;
export function ipcSend(channel: 'captcha:update-status', status: boolean): void;

// Abas
export function ipcSend(channel: 'main-tab:reload'): void;
export function ipcSend(channel: 'main-tab:force-reload'): void;
export function ipcSend(channel: 'current-tab:reload'): void;
export function ipcSend(channel: 'current-tab:force-reload'): void;
export function ipcSend(channel: 'current-tab:home'): void;
export function ipcSend(channel: 'current-tab:back'): void;
export function ipcSend(channel: 'current-tab:forward'): void;
export function ipcSend(channel: 'tab:set-current', tabId: number): void;
export function ipcSend(channel: 'current-tab:navigate-to-place', villageId: number): void;
export function ipcSend(channel: 'current-tab:navigate-to-snob-train', villageId: number): void;
export function ipcSend(channel: 'current-tab:navigate-to-snob-coin', villageId: number, groupId?: number): void;
export function ipcSend(channel: 'tab:destroy', tabId: number): void;
export function ipcSend(channel: 'tab:destroy-all', exclude?: number | number[]): void;
export function ipcSend(channel: 'tab:show-context-menu', tabId: number): void;

// Erros
export function ipcSend(channel: 'error:create-log', err: OmitOptionalErrorLogProps<ErrorLogBase>): void;

// Jogo
export function ipcSend(channel: 'game:update-incomings-amount', incomingAttacks: number | null): void;
export function ipcSend(channel: 'game:update-incomings-info', incomingAttacks: IncomingAttack[]): void;

// Plunder
export function ipcSend(channel: 'plunder:update-config', config: PlunderConfigType): void;
export function ipcSend(channel: 'plunder:attack-sent', currentVillageId: number | null, plunderAttack: PlunderAttack): void;
export function ipcSend(channel: 'plunder:save-history'): void;
export function ipcSend(channel: 'plunder:update-pages-info', villageInfo: PlunderPageListType | null): void;
export function ipcSend(channel: 'plunder:update-group-info', groupInfo: PlunderGroupType | null): void;
export function ipcSend(channel: 'plunder:navigate-to-next-village', currentVillageId?: number | null): void;
export function ipcSend(channel: 'plunder:navigate-to-group'): void;
export function ipcSend(channel: 'plunder:navigate-to-first-page'): void;

// Academia
export function ipcSend(channel: 'snob:update-config', config: SnobConfigType): void;

// IpcTribal
export function ipcSend(channel: 'ipc-tribal:tag-is-ready'): void;
export function ipcSend(channel: 'ipc-tribal:update-game-data', gameData: TribalWarsGameDataType | null): void;

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
    if (debug.enabled) report('renderer', channel, ...args);
    ipcRenderer.send(channel, ...args);
}

export function ipcOn(channel: string, listener: Parameters<typeof Electron.ipcRenderer.on>[1]): void {
    if (debug.enabled) {
        ipcRenderer.on(channel, (_e, ...args) => {
            report('main', channel, ...args);
        });
    }

    ipcRenderer.on(channel, listener);
}

export function ipcOnce(channel: string, listener: Parameters<typeof Electron.ipcRenderer.once>[1]): void {
    if (debug.enabled) {
        ipcRenderer.once(channel, (_e, ...args) => {
            report('main', channel, ...args);
        });
    }

    ipcRenderer.once(channel, listener);
}