export const enum AresAPI {
    Latest = 'https://tb.dev.br/ares/latest.json'
};

export const enum GameUrl {
    Brazil = 'https://www.tribalwars.com.br',
    Global = 'https://www.tribalwars.net',
    Netherlands = 'https://www.tribalwars.nl',
    Portugal = 'https://www.tribalwars.com.pt',
    UnitedKingdom = 'https://www.tribalwars.co.uk',
    UnitedStates = 'https://www.tribalwars.us'
};

export const enum GameEndpoints {
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
};

export const enum GameSearchParams {
    Farm = 'screen=am_farm&order=distance&dir=asc&Farm_page=0',
    Groups = 'screen=overview_villages&&mode=groups&type=static',
    Incomings = 'screen=overview_villages&mode=incomings&type=unignored&subtype=attacks&group=0&page=-1&subtype=attacks',
    SnobTrain = 'screen=snob&mode=train',
    SnobCoin = 'screen=snob&mode=coin&from=-1'
};

export const enum WebsiteUrl {
    Ares = 'https://tb.dev.br/ares',
    Author = 'https://github.com/ferreira-tb',
    Discord = 'https://discord.gg/tNQbrqbmdK',
    Issues = 'https://github.com/ferreira-tb/ares/issues',
    Repository = 'https://github.com/ferreira-tb/ares'
};

export const enum Dimensions {
    TopContainerHeight = 80
};

export const enum ErrorLogFile {
    All = 'error.log',
    ChildProcess = 'child-process-error.log',
    Uncaught = 'uncaught-error.log'
};

export const enum TribalWorkerName {
    FetchWorldConfig = 'fetch-world-config',
    FetchWorldUnits = 'fetch-world-units',
    GetVillageGroups = 'get-village-groups',
    HandleIncomings = 'handle-incomings',
    MintCoin = 'mint-coin'
};

// Jogo.
export const resources = ['wood', 'stone', 'iron'] as const;
export const farmUnits = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'knight'] as const;
export const allUnits = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob', 'militia'] as const;

export const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;

// Mapas.
// TO DO: transformar em JSON.
export const unitsToDestroyWall = {
    '0': {
        spear: 0,
        sword: 0,
        axe: 0,
        archer: 0,
        spy: 0,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 0,
        catapult: 0
    },
    '1': {
        spear: 0,
        sword: 0,
        axe: 50,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 3,
        catapult: 0
    },
    '2': {
        spear: 0,
        sword: 0,
        axe: 50,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 5,
        catapult: 0
    },
    '3': {
        spear: 0,
        sword: 0,
        axe: 50,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 8,
        catapult: 0
    },
    '4': {
        spear: 0,
        sword: 0,
        axe: 75,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 15,
        catapult: 0
    },
    '5': {
        spear: 0,
        sword: 0,
        axe: 100,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 20,
        catapult: 0
    },
    '6': {
        spear: 0,
        sword: 0,
        axe: 150,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 20,
        catapult: 0
    },
    '7': {
        spear: 0,
        sword: 0,
        axe: 150,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 30,
        catapult: 0
    },
    '8': {
        spear: 0,
        sword: 0,
        axe: 300,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 40,
        catapult: 0
    },
    '9': {
        spear: 0,
        sword: 0,
        axe: 300,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 40,
        catapult: 0
    },
    '10': {
        spear: 0,
        sword: 0,
        axe: 400,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 50,
        catapult: 0
    },
    '11': {
        spear: 0,
        sword: 0,
        axe: 400,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 60,
        catapult: 0
    },
    '12': {
        spear: 0,
        sword: 0,
        axe: 500,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 60,
        catapult: 0
    },
    '13': {
        spear: 0,
        sword: 0,
        axe: 500,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 80,
        catapult: 0
    },
    '14': {
        spear: 0,
        sword: 0,
        axe: 600,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 100,
        catapult: 0
    },
    '15': {
        spear: 0,
        sword: 0,
        axe: 800,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 150,
        catapult: 0
    },
    '16': {
        spear: 0,
        sword: 0,
        axe: 1000,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 180,
        catapult: 0
    },
    '17': {
        spear: 0,
        sword: 0,
        axe: 1000,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 180,
        catapult: 0
    },
    '18': {
        spear: 0,
        sword: 0,
        axe: 1100,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 200,
        catapult: 0
    },
    '19': {
        spear: 0,
        sword: 0,
        axe: 1100,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 200,
        catapult: 0
    },
    '20': {
        spear: 0,
        sword: 0,
        axe: 1300,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 200,
        catapult: 0
    }
} as const;