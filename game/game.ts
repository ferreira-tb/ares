class TribalWarsGameData {
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
    readonly screen: GameScreen;
    readonly time_generated: number;
    readonly units: string[];
    readonly version: string;
    readonly village: Village;
    readonly world: string;

    // Timing
    readonly added_server_time = Timing.added_server_time;
    readonly initial_server_time = Timing.initial_server_time;
    readonly offset_from_server = Timing.offset_from_server;
    readonly offset_to_server = Timing.offset_to_server;
    readonly tick_interval = Timing.tick_interval;

    constructor() {
        const game_data = TribalWars.getGameData();

        this.device = game_data.device;
        this.features = game_data.features;
        this.group_id = game_data.group_id;
        this.link_base = game_data.link_base;
        this.link_base_pure = game_data.link_base_pure;
        this.locale = game_data.locale;
        this.majorVersion = game_data.majorVersion;
        this.market = game_data.market;
        this.mode = game_data.mode;
        this.player = game_data.player;
        this.pregame = game_data.pregame;
        this.screen = game_data.screen;
        this.time_generated = game_data.time_generated;
        this.units = game_data.units;
        this.version = game_data.version;
        this.village = game_data.village;
        this.world = game_data.world;
    };
};

class TribalWarsPlunderData {
    readonly current_units = Accountmanager.farm.current_units;
    readonly hide_attacked = Accountmanager.farm.hide_attacked;
    readonly page = Accountmanager.farm.page;
    readonly page_size = Accountmanager.farm.page_size;
};

console.log('Script injetado');
window.addEventListener('message', (e) => console.log(e.data));