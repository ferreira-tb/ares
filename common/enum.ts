export enum AresAPI {
    Latest = 'https://tb.dev.br/ares/latest.json'
}

export enum GameUrl {
    Brazil = 'https://www.tribalwars.com.br',
    Global = 'https://www.tribalwars.net',
    Netherlands = 'https://www.tribalwars.nl',
    Portugal = 'https://www.tribalwars.com.pt',
    UnitedKingdom = 'https://www.tribalwars.co.uk',
    UnitedStates = 'https://www.tribalwars.us'
}

export enum GameEndpoints {
    GetConfig = 'interface.php?func=get_config',
    GetUnitInfo = 'interface.php?func=get_unit_info',
    GetBuildingInfo = 'interface.php?func=get_building_info',

    // `unix_timestamp` não pode ser maior do que 24 horas atrás.
    GetConquer = 'interface.php?func=get_conquer&since=unix_timestamp',

    Village = 'map/village.txt.gz',
    Player = 'map/player.txt.gz',
    Ally = 'map/ally.txt.gz',
    Conquer = 'map/conquer.txt.gz',

    KillAtt = 'map/kill_att.txt.gz',
    KillDef = 'map/kill_def.txt.gz',
    KillSup = 'map/kill_sup.txt.gz',
    KillAll = 'map/kill_all.txt.gz',

    KillAttTribe = 'map/kill_att_tribe.txt.gz',
    KillDefTribe = 'map/kill_def_tribe.txt.gz',
    KillAllTribe = 'map/kill_all_tribe.txt.gz'
}

export enum GameSearchParams {
    /** Diplomacia da tribo. */
    Contracts = 'screen=ally&mode=contracts',
    /** Assistente de saque. */
    Farm = 'screen=am_farm&order=distance&dir=asc&Farm_page=0',
    /** Ataques a caminho (todas as aldeias). */
    Incomings = 'screen=overview_villages&mode=incomings&type=unignored&subtype=attacks&group=0&page=-1&subtype=attacks',
    /** Academia (recrutamento). */
    SnobTrain = 'screen=snob&mode=train',
    /** Academia (cunhagem em massa). */
    SnobCoin = 'screen=snob&mode=coin&from=-1',
    /** Grupos manuais. */
    StaticGroups = 'screen=overview_villages&mode=groups&type=static',
    /** Grupos manuais, mas com todas as aldeias. */
    StaticGroupsAllVillages = 'screen=overview_villages&mode=groups&type=static&group=0&page=-1',
    /** Visualização geral: tropas. */
    OverviewUnitsComplete = 'screen=overview_villages&mode=units&type=complete&page=-1'
}

export enum TribalWorkerName {
    AddVillagesToGroup = 'add-villages-to-group',
    CountTroops = 'count-troops',
    CreateStaticGroup = 'create-static-group',
    FetchDiplomacy = 'fetch-diplomacy',
    FetchWorldConfig = 'fetch-world-config',
    FetchWorldUnits = 'fetch-world-units',
    GetVillageGroups = 'get-village-groups',
    HandleIncomings = 'handle-incomings',
    MintCoin = 'mint-coin'
}

export enum RendererWorkerName {
    CalcSafeZoneVillages = 'calc-safe-zone-villages'
}

export enum StandardWindowName {
    Config = 'config',
    ConfigAdvanced = 'config-advanced',
    ConfigGeneral = 'config-general',
    ConfigNotifications = 'config-notifications',
    ConfigTags = 'config-tags',
    Debug = 'debug',
    Default = 'default',
    ErrorLog = 'error-log',
    GroupTemplate = 'group-template',
    GroupTemplateSafeZone = 'group-template-safe-zone',
    Panel = 'panel',
    PanelBot = 'panel-bot',
    PanelBotBuildingsSnob = 'panel-bot-buildings-snob',
    PanelBotOverview = 'panel-bot-overview',
    PanelBotPlunder = 'panel-bot-plunder',
    PanelTools = 'panel-tools',
    PlunderCustomTemplate = 'plunder-custom-template',
    PlunderDemolitionTemplate = 'plunder-demolition-template',
    PlunderHistory = 'plunder-history',
    TroopsCounter = 'troops-counter',
    Update = 'update'
}

export enum WebsiteUrl {
    Ares = 'https://tb.dev.br/ares',
    Author = 'https://github.com/ferreira-tb',
    Discord = 'https://discord.gg/tNQbrqbmdK',
    HowToUse = 'https://tb.dev.br/ares/guide/how-to-use.html',
    Issues = 'https://github.com/ferreira-tb/ares/issues',
    Repository = 'https://github.com/ferreira-tb/ares'
}

export enum Dimensions {
    /** Altura do container do menu superior da UI. */
    TopContainerHeight = 80
}

// Jogo.
// TODO: transformar em JSON.
export const resources = ['wood', 'stone', 'iron'] as const;
export const farmUnits = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'knight'] as const;
export const allUnits = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob', 'militia'] as const;

export const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;