declare global {
    const Accountmanager: {
        readonly farm: RawPlunderInfo
    };

    const InfoPlayer: {
        readonly player_id: number;
        init(): void;
    };

    const Market: {
        readonly data: {
            readonly Res: ResourceAmount;
            readonly Trader: MarketDataTrader;
        }
    };
    
    const PremiumExchange: {
        readonly TYPE_BUY: 'buy';
        readonly TYPE_SELL: 'sell';
    
        init(): void;
        inputChanged(): void;
        updateUI(): void;
    
        readonly data: {
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

        readonly graph: {
            readonly type: string;
            readonly data: [
                PremiumExchangeGraphResourceData,
                PremiumExchangeGraphResourceData,
                PremiumExchangeGraphResourceData
            ];
            
            graph(): void;
            invertYAxis(): void;
            plot(): void;
        }
    };

    const Timing: {
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
    };

    const TribalWars: {
        getGameData(): RawTribalWarsGameData;
        getIdleTime(): number;
    };

    const UI: {
        ErrorMessage(message: string): void;
        InfoMessage(message: string): void;
        SuccessMessage(message: string): void;
    };
}

export {};