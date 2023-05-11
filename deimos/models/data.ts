import { isString, isInteger } from '$global/guards';
import { isWorld } from '$global/guards';

/** `null` indica que o usuário se encontra numa página a partir da qual não é possível obter essas informações. */
export class TribalWarsGameData implements TribalWarsGameDataType {
    public readonly ares: TribalWarsGameDataType['ares'];
    public readonly features: TribalWarsGameDataType['features'];
    public readonly groups: TribalWarsGameDataType['groups'];
    public readonly player: TribalWarsGameDataType['player'];
    public readonly currentVillage: TribalWarsGameDataType['currentVillage'];

    constructor(rawGameData: RawTribalWarsGameData) {
        this.ares = {
            locale: isString(rawGameData.locale) ? rawGameData.locale : null,
            world: isWorld(rawGameData.world) ? rawGameData.world : null,
            majorVersion: isString(rawGameData.majorVersion) ? rawGameData.majorVersion : null,
            screen: isString(rawGameData.screen) ? rawGameData.screen : null,
            screenMode: isString(rawGameData.mode) ? rawGameData.mode : null,
            pregame: typeof rawGameData.pregame === 'boolean' ? rawGameData.pregame : null
        };

        const premium = rawGameData.features.Premium.active;
        const accountManager = rawGameData.features.AccountManager.active;
        const farmAssistant = rawGameData.features.FarmAssistent.active;

        this.features = {
            premium: typeof premium === 'boolean' ? premium : null,
            accountManager: typeof accountManager === 'boolean' ? accountManager : null,
            // No jogo consta como FarmAssistent, mas no Deimos está como FarmAssistant.
            farmAssistant: typeof farmAssistant === 'boolean' ? farmAssistant : null
        };

        // O valor de group_id pode ser uma string ou um número.
        const groupId = isInteger(rawGameData.group_id) ? rawGameData.group_id :
            isString(rawGameData.group_id) ? Number.parseIntStrict(rawGameData.group_id) : null;

        this.groups = { groupId };

        const playerPoints = isInteger(rawGameData.player.points) ? rawGameData.player.points :
            isString(rawGameData.player.points) ? Number.parseIntStrict(rawGameData.player.points) : null;

        const villageAmount = isInteger(rawGameData.player.villages) ? rawGameData.player.villages :
            isString(rawGameData.player.villages) ? Number.parseIntStrict(rawGameData.player.villages) : null;

        this.player = {
            name: isString(rawGameData.player.name) ? rawGameData.player.name : null,
            id: isInteger(rawGameData.player.id) ? rawGameData.player.id : null,
            points: playerPoints,
            villageAmount
        };

        const currentVillagePoints = isInteger(rawGameData.village.points) ? rawGameData.village.points :
            isString(rawGameData.village.points) ? Number.parseIntStrict(rawGameData.village.points) : null;

        const population = isInteger(rawGameData.village.pop) ? rawGameData.village.pop :
            isString(rawGameData.village.pop) ? Number.parseIntStrict(rawGameData.village.pop) : null;

        const maxPopulation = isInteger(rawGameData.village.pop_max) ? rawGameData.village.pop_max :
            isString(rawGameData.village.pop_max) ? Number.parseIntStrict(rawGameData.village.pop_max) : null;

        const wood = isInteger(rawGameData.village.wood) ? rawGameData.village.wood :
            isString(rawGameData.village.wood) ? Number.parseIntStrict(rawGameData.village.wood) : null;

        const stone = isInteger(rawGameData.village.stone) ? rawGameData.village.stone :
            isString(rawGameData.village.stone) ? Number.parseIntStrict(rawGameData.village.stone) : null;

        const iron = isInteger(rawGameData.village.iron) ? rawGameData.village.iron :
            isString(rawGameData.village.iron) ? Number.parseIntStrict(rawGameData.village.iron) : null;

        const maxStorage = isInteger(rawGameData.village.storage_max) ? rawGameData.village.storage_max :
            isString(rawGameData.village.storage_max) ? Number.parseIntStrict(rawGameData.village.storage_max) : null;

        this.currentVillage = {
            x: isInteger(rawGameData.village.x) ? rawGameData.village.x : null,
            y: isInteger(rawGameData.village.y) ? rawGameData.village.y : null,
            id: isInteger(rawGameData.village.id) ? rawGameData.village.id : null,
            name: isString(rawGameData.village.name) ? rawGameData.village.name : null,
            points: currentVillagePoints,
            population,
            maxPopulation,
            wood,
            stone,
            iron,
            maxStorage
        };
    };
};