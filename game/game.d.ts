type Features = {
    AccountManager: ActivePossible;
    FarmAssistent: ActivePossible;
    Premium: ActivePossible
};

type ActivePossible = {
    active: boolean;
    possible: boolean;
};

type Player = {
    ally: string;
    ally_level: string;
    ally_member_count: string;
    confirmation_skipping_hash: string;
    date_started: string;
    email_valid: string;
    id: number;
    incomings: string;
    is_guest: string;
    knight_location: string;
    knight_unit: string;
    name: string;
    new_ally_application: string;
    new_ally_invite: string;
    new_buddy_request: string;
    new_daily_bonus: string;
    new_forum_post: string;
    new_igm: string;
    new_items: string;
    new_post_notification: number;
    new_quest: string;
    new_report: string;
    points: string;
    points_formatted: string;
    pp: string;
    quest_progress: string;
    rank: number;
    rank_formatted: string;
    sitter: string;
    sitter_type: string;
    sleep_end: string;
    sleep_last: string;
    sleep_start: string;
    supports: string;
    villages: string;
};

type Village = {
    buildings: Buildings;
    coord: string;
    display_name: string;
    id: number;
    iron: number;
    iron_float: number;
    iron_prod: number;
    is_farm_upgradable: boolean;
    last_res_tick: number;
    modifications: number;
    name: string;
    player_id: number;
    points: number;
    pop: number;
    pop_max: number;
    stone: number;
    stone_float: number;
    stone_prod: number;
    storage_max: number;
    trader_away: number;
    wood: number;
    wood_float: number;
    wood_prod: number;
    x: number;
    y: number;
};

type Buildings = {
    barracks: string;
    farm: string;
    garage: string;
    hide: string;
    iron: string;
    main: string;
    market: string;
    place: string;
    smith: string;
    snob: string;
    stable: string;
    statue: string;
    stone: string;
    storage: string;
    wall: string;
    watchtower: string;
    wood: string;
};

type ResourceList = 'wood' | 'stone' | 'iron';
type ResourceListPTBR = 'Madeira' | 'Argila' | 'Ferro';
type ResourceAmount = { [index in ResourceList]: number };

/** Unidades que podem ser usadas no assistente de saque. */
type FarmUnits =
    | 'spear'
    | 'sword'
    | 'axe'
    | 'spy'
    | 'light'
    | 'heavy'
    | 'knight'

/** Unidades que podem ser usadas no assistente de saque em mundos com arqueiros. */
type FarmUnitsWithArchers =
    | FarmUnits
    | 'archer'
    | 'marcher'

/** Unidades que não podem saquear. */
type OtherUnits =
    | 'ram'
    | 'catapult'
    | 'snob';

/** Todas as unidades do jogo. */
type UnitList =
    | FarmUnits
    | OtherUnits;

/** Todas as unidades do jogo em mundos com arqueiros. */
type UnitListWithArchers = 
    | FarmUnitsWithArchers
    | OtherUnits;

/** Janelas do jogo. */
type GameScreen =
    | 'am_farm'
    | 'info_player'
    | 'market'
    | 'overview'
    | 'overview_villages'
    | 'place'
    | 'report';

declare namespace TribalWars {
    function getGameData(): TribalWarsGameData;
    function getIdleTime(): number;
}

declare const game_data: TribalWarsGameData;
declare const mobile: boolean;
declare const mobile_on_normal: boolean;
declare const mobiledevice: boolean;
declare const premium: boolean;
declare const server_utc_diff: number;

declare function getLocalTimeAsFloat(): number;

declare namespace Timing {
    const added_server_time: number;
    const initial_server_time: number;
    const is_ready: boolean;
    const offset_from_server: number;
    const offset_to_server: number;
    const paused: boolean;
    const tick_interval: number;

    function getCurrentServerTime(): number;
    function getElapsedTimeSinceData(): number;
    function getElapsedTimeSinceLoad(): number;
    function getReturnTimeFromServer(): number;
}

declare namespace PremiumExchange {
    const TYPE_BUY = 'buy';
    const TYPE_SELL = 'sell';

    function init(): void;
    function inputChanged(): void;
    function updateUI(): void;
}

declare namespace PremiumExchange.data {
    const capacity: ResourceAmount;

    const constants: {
        resource_base_price: number;
        resource_price_elasticity: number;
        stock_size_modifier: number;
    };

    const duration: number;
    const merchants: number;
    const rates: ResourceAmount;
    const status_bar: string;
    const stock: ResourceAmount;
    
    const tax: {
        buy: number;
        sell: number;
    };
}

declare namespace PremiumExchange.graph {
    type ResourceData = {
        color: string;
        data: [number, string][];
        details: { res_type: ResourceList }[]
        label: ResourceListPTBR;
    };
    
    const data: [ResourceData, ResourceData, ResourceData];
    const type: string;

    function graph(): void;
    function invertYAxis(): void;
    function plot(): void;
}

declare namespace Market.Data {
    type MarketTrader = {
        amount: number;
        carry: number;
        total: number; 
    };

    const Res: ResourceAmount;
    const Trader: MarketTrader;
}

declare namespace Accountmanager.farm {
    const current_units: {
        [index in UnitListWithArchers | 'militia']: string;
    };

    const extended: boolean;
    const hide_attacked: boolean;
    const last_click: number;
    const page: number;
    const page_size: number;
    const plunders_exhausted: boolean;
    const should_update_queue: boolean;
    const waiting_for_display_queue_load: boolean;

    function init(): void;

    function setPageSize(size: number): boolean;
}

declare namespace InfoPlayer {
    const player_id: number;

    function init(): void;
}

declare namespace UI {
    function ErrorMessage(message: string): void;
    function InfoMessage(message: string): void;
    function SuccessMessage(message: string): void;
}