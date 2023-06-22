type UserAlias = `${World}_${string}`;
type GameRegion = 'br' | 'en' | 'nl' | 'pt' | 'uk' | 'us';
type World =
    // eslint-disable-next-line @typescript-eslint/sort-type-constituents
    | `${GameRegion}${string}` // Mundo padrão.
    | `${GameRegion}s${string}` // Rodada speed.
    | `${GameRegion}p${string}`; // Mundo casual.

// RECURSOS
type Resources = 'iron' | 'stone' | 'wood';
type ResourcesPTBR = 'Argila' | 'Ferro' | 'Madeira';
type ResourceAmount = { [key in Resources]: number };

// UNIDADES
/** Unidades que podem ser usadas no assistente de saque. */
type FarmUnits =
    'archer' | 'axe' | 'heavy' | 'knight' | 'light' | 'marcher' | 'spear' | 'spy' | 'sword';

/** Unidades que não podem saquear. */
type OtherUnits =
    'catapult' | 'militia' | 'ram' | 'snob';

/** Todas as unidades do jogo. */
type AllUnits =
    | FarmUnits
    | OtherUnits;

type FarmUnitsAmount = { [key in FarmUnits]: number };
type UnitAmount = { [key in AllUnits]: number };
type UnitsAmountAsStrings = { [key in AllUnits]: string };
type PlaceUnitsAmount = Partial<Omit<UnitAmount, 'militia'>>;

// CONSTRUÇÕES
type WallLevel = IntRange<0, 21>;
type StringWallLevel = IntRangeToString<0, 21>;

// ATAQUE A CAMINHO
type IncomingAttack = {
    /** ID do ataque. */
    readonly id: number;
    /** ID da aldeia alvo. */
    readonly target: number;
    /** ID da aldeia de origem. */
    readonly origin: number;
    /** ID do jogador atacante. */
    readonly attacker: number;
    /** Data de chegada do ataque. */
    readonly arrivalTime: number;
    /** Data em que o ataque foi registrado. */
    readonly addedAt: number;
};

// TRIBOS
type RawDiplomacy = {
    readonly allies: number[];
    readonly enemies: number[];
    readonly nap: number[];
};

type Diplomacy = {
    readonly allies: WorldAllyType[];
    readonly enemies: WorldAllyType[];
    readonly nap: WorldAllyType[];
};

// OUTROS
type DemolitionTroops = Omit<UnitAmount, 'knight' | 'militia' | 'snob'>;
type UnitsToDestroyWall = Record<StringWallLevel, DemolitionTroops>;

type GameScreen =
    'am_farm' | 'info_player' | 'market' | 'overview_villages' | 'overview' | 'place' | 'report' | 'snob';

type Coords = {
    x: number;
    y: number;
};

type VillageGroup = {
    readonly id: number;
    /** Nome do grupo após codificado pela função `encodeURIComponent`. */
    readonly name: string;
    readonly type: 'dynamic' | 'static';
};

type VillageGroupsType = {
    /** Todos os grupos de aldeias referentes a um determinado alias. */
    readonly allGroups: VillageGroup[];
};

type TroopCounterResult = {
    /** Unidades próprias presentes na aldeia. */
    readonly available: UnitAmount;
    /** Unidades próprias fora da aldeia. */
    readonly away: UnitAmount;
    /** Unidades próprias em trânsito. */
    readonly moving: UnitAmount;
    /** Soma das unidades próprias presentes na aldeia, fora e em trânsito. */
    readonly own: UnitAmount;

    /** Diferença entre a quantidade de unidades na aldeia e a quantidade de unidades próprias presentes nela. */
    readonly support: UnitAmount;
    /** Quantidade total de unidades na aldeia. */
    readonly village: UnitAmount;
};

interface TribalWarsGameDataType {
    /** Local. */
    readonly locale: string | null;
    /** Mundo atual. */
    readonly world: World | null;
    /** Versão do Tribal Wars. */
    readonly majorVersion: string | null;
    /** Janela atual. */
    readonly screen: string | null;
    /** Modo da janela atual. */
    readonly screenMode: string | null;
    /** Indica se está no modo de pré-jogo. */
    readonly pregame: boolean | null;
    /** ID do grupo de aldeias atual. */
    readonly groupId: number | null;

    readonly features: {
        /** Conta premium. */
        readonly premium: boolean | null;
        /** Gerente de conta. */
        readonly accountManager: boolean | null;
        /** Assistente de saque. */
        readonly farmAssistant: boolean | null;
    };

    readonly player: {
        /** Nome do jogador ativo. */
        readonly name: string | null;
        /** ID do jogador ativo. */
        readonly id: number | null;
        /** Pontuação do jogador. */
        readonly points: number;
        /** Quantidade de aldeias que o jogador possui. */
        readonly villageAmount: number;
        /** Tribo do jogador. */
        readonly ally: number;
    };
    
    readonly village: {
        /** Coordenada X da aldeia atual. */
        readonly x: number | null;
        /** Coordenada Y da aldeia atual. */
        readonly y: number | null;
        /** ID da aldeia atual. */
        readonly id: number | null;
        /** Nome da aldeia atual. */
        readonly name: string | null;
        /** População da aldeia atual. */
        readonly population: number | null;
        /** População máxima da aldeia atual. */
        readonly maxPopulation: number | null;
        /** Pontos da aldeia atual. */
        readonly points: number | null;
        /** Quantidade de madeira na aldeia atual. */
        readonly wood: number | null;
        /** Quantidade de argila na aldeia atual. */
        readonly stone: number | null;
        /** Quantidade de ferro na aldeia atual. */
        readonly iron: number | null;
        /** Capacidade de armazenamento máximo da aldeia atual. */
        readonly maxStorage: number | null;
    };
}

interface TribalWarsTimingType {
    readonly addedServerTime: number;
    readonly initialServerTime: number;
    readonly isReady: boolean;
    readonly offsetFromServer: number;
    readonly offsetToServer: number;
    readonly paused: boolean;
    readonly tickInterval: number;
}