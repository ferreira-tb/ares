import { isBoolean, isString, isInteger, toNull } from '@tb-dev/ts-guard';
import type { RawTribalWarsGameData } from '$types/deimos.js';

/** `null` indica que o usuário se encontra numa página a partir da qual não é possível obter essas informações. */
export class TribalWarsGameData {
    /** Mundo atual. */
    public readonly currentWorld: string | null;
    /** Versão do Tribal Wars. */
    public readonly majorVersion: string | null;
    /** Nome do jogador ativo. */
    public readonly currentPlayer: string | null;
    /** ID do jogador ativo. */
    public readonly currentPlayerId: number | null;
    /** Pontuação do jogador. */
    public readonly currentPlayerPoints: number | null;
    /** Quantidade de aldeias que o jogador possui. */
    public readonly villageAmount: number | null;
    /** Grupo de aldeias atual. */
    public readonly groupId: number | null;

    /** Conta premium. */
    public readonly premium: boolean | null;
    /** Gerente de conta. */
    public readonly accountManager: boolean | null;
    /** Assistente de saque. */
    public readonly farmAssistant: boolean | null;

    /** Janela atual. */
    public readonly currentScreen: string | null;
    /** Modo da janela atual. */
    public readonly screenMode: string | null;
    /** Indica se está no modo de pré-jogo. */
    public readonly pregame: boolean | null;

    /** Coordenada X da aldeia atual. */
    public readonly currentX: number | null;
    /** Coordenada Y da aldeia atual. */
    public readonly currentY: number | null;
    /** ID da aldeia atual. */
    public readonly currentVillageId: number | null;
    /** Nome da aldeia atual. */
    public readonly currentVillageName: string | null;
    /** População da aldeia atual. */
    public readonly currentVillagePopulation: number | null;
    /** População máxima da aldeia atual. */
    public readonly currentVillageMaxPopulation: number | null;
    /** Pontos da aldeia atual. */
    public readonly currentVillagePoints: number | null;
    /** Quantidade de madeira na aldeia atual. */
    public readonly currentVillageWood: number | null;
    /** Quantidade de argila na aldeia atual. */
    public readonly currentVillageStone: number | null;
    /** Quantidade de ferro na aldeia atual. */
    public readonly currentVillageIron: number | null;
    /** Capacidade de armazenamento máximo da aldeia atual. */
    public readonly currentVillageMaxStorage: number | null;

    constructor(rawGameData: RawTribalWarsGameData) {
        this.currentWorld = toNull(rawGameData.world, isString);
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