import { isBoolean, isString, isInteger, toNull } from '@tb-dev/ts-guard';
import { isWorld } from '$global/utils/guards.js';
import type { RawTribalWarsGameData, TribalWarsGameDataType } from '$types/deimos.js';
import type { World } from '$types/game.js';

/** `null` indica que o usuário se encontra numa página a partir da qual não é possível obter essas informações. */
export class TribalWarsGameData implements TribalWarsGameDataType {
    public readonly locale: string | null;
    public readonly currentWorld: World | null;
    public readonly majorVersion: string | null;
    public readonly currentPlayer: string | null;
    public readonly currentPlayerId: number | null;
    public readonly currentPlayerPoints: number | null;
    public readonly villageAmount: number | null;
    public readonly groupId: number | null;

    public readonly premium: boolean | null;
    public readonly accountManager: boolean | null;
    public readonly farmAssistant: boolean | null;

    public readonly currentScreen: string | null;
    public readonly screenMode: string | null;
    public readonly pregame: boolean | null;

    public readonly currentX: number | null;
    public readonly currentY: number | null;
    public readonly currentVillageId: number | null;
    public readonly currentVillageName: string | null;
    public readonly currentVillagePopulation: number | null;
    public readonly currentVillageMaxPopulation: number | null;
    public readonly currentVillagePoints: number | null;
    public readonly currentVillageWood: number | null;
    public readonly currentVillageStone: number | null;
    public readonly currentVillageIron: number | null;
    public readonly currentVillageMaxStorage: number | null;

    constructor(rawGameData: RawTribalWarsGameData) {
        this.locale = toNull(rawGameData.locale, isString);
        this.currentWorld = isWorld(rawGameData.world) ? rawGameData.world : null;
        this.majorVersion = toNull(rawGameData.majorVersion, isString);
        this.currentPlayer = toNull(rawGameData.player.name, isString);
        this.currentPlayerId = toNull(rawGameData.player.id, isInteger);
        this.currentPlayerPoints = isString(rawGameData.player.points) ? Number.parseIntStrict(rawGameData.player.points) : null;
        this.villageAmount = isString(rawGameData.player.villages) ? Number.parseIntStrict(rawGameData.player.villages) : null;
        this.groupId = isString(rawGameData.group_id) ? Number.parseIntStrict(rawGameData.group_id) : null;

        this.premium = toNull(rawGameData.features.Premium.active, isBoolean);
        this.accountManager = toNull(rawGameData.features.AccountManager.active, isBoolean);
        // No jogo consta como FarmAssistent, mas no Deimos está como FarmAssistant.
        this.farmAssistant = toNull(rawGameData.features.FarmAssistent.active, isBoolean);

        this.currentScreen = toNull(rawGameData.screen, isString);
        this.screenMode = toNull(rawGameData.mode, isString);
        this.pregame = toNull(rawGameData.pregame, isBoolean);

        this.currentX = toNull(rawGameData.village.x, isInteger);
        this.currentY = toNull(rawGameData.village.y, isInteger);
        this.currentVillageId = toNull(rawGameData.village.id, isInteger);
        this.currentVillageName = toNull(rawGameData.village.name, isString);
        this.currentVillagePopulation = toNull(rawGameData.village.pop, isInteger);
        this.currentVillageMaxPopulation = toNull(rawGameData.village.pop_max, isInteger);
        this.currentVillagePoints = toNull(rawGameData.village.points, isInteger);
        this.currentVillageWood = toNull(rawGameData.village.wood, isInteger);
        this.currentVillageStone = toNull(rawGameData.village.stone, isInteger);
        this.currentVillageIron = toNull(rawGameData.village.iron, isInteger);
        this.currentVillageMaxStorage = toNull(rawGameData.village.storage_max, isInteger);
    };
};