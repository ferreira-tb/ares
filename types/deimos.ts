import type { AllUnits, Resources, ResourcesPTBR, ResourceAmount } from '$types/game.js';

export type ActivePossible = {
    active: boolean,
    possible: boolean
};

export type Features = {
    AccountManager: ActivePossible,
    FarmAssistent: ActivePossible,
    Premium: ActivePossible
};

export type Player = {
    ally: string,
    ally_level: string,
    ally_member_count: string,
    confirmation_skipping_hash: string,
    date_started: string,
    email_valid: string,
    id: number,
    incomings: string,
    is_guest: string,
    knight_location: string,
    knight_unit: string,
    name: string,
    new_ally_application: string,
    new_ally_invite: string,
    new_buddy_request: string,
    new_daily_bonus: string,
    new_forum_post: string,
    new_igm: string,
    new_items: string,
    new_post_notification: number,
    new_quest: string,
    new_report: string,
    points: string,
    points_formatted: string,
    pp: string,
    quest_progress: string,
    rank: number,
    rank_formatted: string,
    sitter: string,
    sitter_type: string,
    sleep_end: string,
    sleep_last: string,
    sleep_start: string,
    supports: string,
    villages: string,
};

export type Village = {
    buildings: Buildings,
    coord: string,
    display_name: string,
    id: number,
    iron: number,
    iron_float: number,
    iron_prod: number,
    is_farm_upgradable: boolean,
    last_res_tick: number,
    modifications: number,
    name: string,
    player_id: number,
    points: number,
    pop: number,
    pop_max: number,
    stone: number,
    stone_float: number,
    stone_prod: number,
    storage_max: number,
    trader_away: number,
    wood: number,
    wood_float: number,
    wood_prod: number,
    x: number,
    y: number,
};

export type Buildings = {
    barracks: string,
    farm: string,
    garage: string,
    hide: string,
    iron: string,
    main: string,
    market: string,
    place: string,
    smith: string,
    snob: string,
    stable: string,
    statue: string,
    stone: string,
    storage: string,
    wall: string,
    watchtower: string,
    wood: string,
};

export interface TribalWarsGameData {
    // TribalWars.getGameData()
    readonly device: string;
    readonly features: Features;
    readonly group_id: string;
    readonly link_base: string;
    readonly link_base_pure: string;
    readonly locale: string;
    readonly majorVersion: string;
    readonly market: string;
    readonly mode: string | null;
    readonly player: Player;
    readonly pregame: boolean;
    readonly screen: string;
    readonly time_generated: number;
    readonly units: string[];
    readonly version: string;
    readonly village: Village;
    readonly world: string;
};

export interface TribalWarsType {
    getGameData(): TribalWarsGameData;
    getIdleTime(): number;
}

export interface TimingType {
    readonly added_server_time: number;
    readonly initial_server_time: number;
    readonly is_ready: boolean;
    readonly offset_from_server: number;
    readonly offset_to_server: number;
    readonly paused: boolean;
    readonly tick_interval: number;

    getCurrentServerTime(): number;
    getElapsedTimeSinceData(): number;
    getElapsedTimeSinceLoad(): number;
    getReturnTimeFromServer(): number;
}

export interface PremiumExchangeType {
    readonly TYPE_BUY: 'buy';
    readonly TYPE_SELL: 'sell';

    init(): void;
    inputChanged(): void;
    updateUI(): void;

    readonly data: PremiumExchangeData;
    readonly graph: PremiumExchangeGraph;
}

export type PremiumExchangeData = {
    readonly capacity: ResourceAmount;

    readonly constants: {
        readonly resource_base_price: number;
        readonly resource_price_elasticity: number;
        readonly stock_size_modifier: number;
    };

    readonly duration: number;
    readonly merchants: number;
    readonly rates: ResourceAmount;
    readonly status_bar: string;
    readonly stock: ResourceAmount;

    readonly tax: {
        readonly buy: number;
        readonly sell: number;
    };
};

export interface PremiumExchangeGraph {
    readonly type: string;

    readonly ResourceData: {
        color: string;
        data: [number, string][];
        details: { res_type: Resources }[]
        label: ResourcesPTBR;
    };

    readonly data: [
        PremiumExchangeGraph['ResourceData'],
        PremiumExchangeGraph['ResourceData'],
        PremiumExchangeGraph['ResourceData']
    ];
    
    graph(): void;
    invertYAxis(): void;
    plot(): void;
}

export interface MarketType {
    data: MarketDataType
}

export interface MarketDataType {
    readonly MarketTrader: {
        amount: number;
        carry: number;
        total: number;
    };

    readonly Res: ResourceAmount;
    readonly Trader: MarketDataType['MarketTrader'];
}

export interface AccountManagerType {
    readonly farm: AccountManagerFarmType
}

export interface AccountManagerFarmType {
    readonly current_units: {
        [index in AllUnits]: string;
    };

    readonly extended: boolean;
    readonly hide_attacked: boolean;
    readonly last_click: number;
    readonly page: number;
    readonly page_size: number;
    readonly plunders_exhausted: boolean;
    readonly should_update_queue: boolean;
    readonly waiting_for_display_queue_load: boolean;

    init(): void;
    setPageSize(size: number): boolean;
}

export interface InfoPlayerType {
    readonly player_id: number;
    init(): void;
}

export interface UIType {
    ErrorMessage(message: string): void;
    InfoMessage(message: string): void;
    SuccessMessage(message: string): void;
}