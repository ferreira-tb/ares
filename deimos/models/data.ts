import { isBoolean, isString, isInteger, toNull } from '@tb-dev/ts-guard';
import { isWorld } from '$global/guards';
import type { RawTribalWarsGameData } from '$types/deimos';
import type { TribalWarsGameDataType } from '$types/game';

/** `null` indica que o usuário se encontra numa página a partir da qual não é possível obter essas informações. */
export class TribalWarsGameData implements TribalWarsGameDataType {
    public readonly ares: TribalWarsGameDataType['ares'];
    public readonly features: TribalWarsGameDataType['features'];
    public readonly groups: TribalWarsGameDataType['groups'];
    public readonly player: TribalWarsGameDataType['player'];
    public readonly currentVillage: TribalWarsGameDataType['currentVillage'];

    constructor(rawGameData: RawTribalWarsGameData) {
        this.ares = {
            locale: toNull(rawGameData.locale, isString),
            world: isWorld(rawGameData.world) ? rawGameData.world : null,
            majorVersion: toNull(rawGameData.majorVersion, isString),
            screen: toNull(rawGameData.screen, isString),
            screenMode: toNull(rawGameData.mode, isString),
            pregame: toNull(rawGameData.pregame, isBoolean)
        };

        this.features = {
            premium: toNull(rawGameData.features.Premium.active, isBoolean),
            accountManager: toNull(rawGameData.features.AccountManager.active, isBoolean),
            // No jogo consta como FarmAssistent, mas no Deimos está como FarmAssistant.
            farmAssistant: toNull(rawGameData.features.FarmAssistent.active, isBoolean)
        };

        // O valor de group_id pode ser uma string ou um número.
        const groupId = isInteger(rawGameData.group_id) ? rawGameData.group_id :
            isString(rawGameData.group_id) ? Number.parseIntStrict(rawGameData.group_id) : null;

        this.groups = { groupId };

        this.player = {
            name: toNull(rawGameData.player.name, isString),
            id: toNull(rawGameData.player.id, isInteger),
            points: isString(rawGameData.player.points) ? Number.parseIntStrict(rawGameData.player.points) : null,
            villageAmount: isString(rawGameData.player.villages) ? Number.parseIntStrict(rawGameData.player.villages) : null
        };

        this.currentVillage = {
            x: toNull(rawGameData.village.x, isInteger),
            y: toNull(rawGameData.village.y, isInteger),
            id: toNull(rawGameData.village.id, isInteger),
            name: toNull(rawGameData.village.name, isString),
            points: isString(rawGameData.village.points) ? Number.parseIntStrict(rawGameData.village.points) : null,
            population: isString(rawGameData.village.pop) ? Number.parseIntStrict(rawGameData.village.pop) : null,
            maxPopulation: isString(rawGameData.village.pop_max) ? Number.parseIntStrict(rawGameData.village.pop_max) : null,
            wood: isString(rawGameData.village.wood) ? Number.parseIntStrict(rawGameData.village.wood) : null,
            stone: isString(rawGameData.village.stone) ? Number.parseIntStrict(rawGameData.village.stone) : null,
            iron: isString(rawGameData.village.iron) ? Number.parseIntStrict(rawGameData.village.iron) : null,
            maxStorage: isString(rawGameData.village.storage_max) ? Number.parseIntStrict(rawGameData.village.storage_max) : null
        };
    };
};