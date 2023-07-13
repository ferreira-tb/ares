import { isEmpty, isInteger, isString } from 'lodash-es';
import { isWorld } from '$common/guards';

/** `null` indica que o usuário se encontra numa página a partir da qual não é possível obter essas informações. */
export class TribalWarsGameData implements TribalWarsGameDataType {
    public readonly features: TribalWarsGameDataType['features'];
    public readonly player: TribalWarsGameDataType['player'];
    public readonly village: TribalWarsGameDataType['village'];

    public readonly locale: string | null;
    public readonly world: World | null;
    public readonly majorVersion: string | null;
    public readonly screen: string | null;
    public readonly screenMode: string | null;
    public readonly pregame: boolean | null;
    public readonly groupId: number | null;

    constructor(raw: RawTribalWarsGameData) {
        this.locale = isString(raw.locale) && !isEmpty(raw.locale) ? raw.locale : null;
        this.world = isWorld(raw.world) ? raw.world : null;
        this.majorVersion = isString(raw.majorVersion) && !isEmpty(raw.majorVersion) ? raw.majorVersion : null;
        this.screen = isString(raw.screen) && !isEmpty(raw.screen) ? raw.screen : null;
        this.screenMode = isString(raw.mode) && !isEmpty(raw.mode) ? raw.mode : null;
        this.pregame = typeof raw.pregame === 'boolean' ? raw.pregame : null;

        // O valor de group_id pode ser uma string ou um número.
        let groupId: number | null = isString(raw.group_id) ? Number.parseIntStrict(raw.group_id) : raw.group_id;
        if (!isInteger(groupId)) groupId = null;
        this.groupId = groupId;

        const premium = raw.features.Premium.active;
        const accountManager = raw.features.AccountManager.active;
        const farmAssistant = raw.features.FarmAssistent.active;

        this.features = {
            premium: typeof premium === 'boolean' ? premium : null,
            accountManager: typeof accountManager === 'boolean' ? accountManager : null,
            // No jogo consta como FarmAssistent, mas no IpcTribal é usado como FarmAssistant.
            farmAssistant: typeof farmAssistant === 'boolean' ? farmAssistant : null
        };

        this.player = {
            name: isString(raw.player.name) && !isEmpty(raw.player.name) ? raw.player.name : null,
            id: isInteger(raw.player.id) ? raw.player.id : null,
            points: isString(raw.player.points) ? Number.parseIntStrict(raw.player.points) : 0,
            villageAmount: isString(raw.player.villages) ? Number.parseIntStrict(raw.player.villages) : 0,
            ally: isString(raw.player.ally) ? Number.parseIntStrict(raw.player.ally) : 0
        };

        this.village = {
            x: isInteger(raw.village.x) ? raw.village.x : null,
            y: isInteger(raw.village.y) ? raw.village.y : null,
            id: isInteger(raw.village.id) ? raw.village.id : null,
            name: isString(raw.village.name) && !isEmpty(raw.village.name) ? raw.village.name : null,
            points: isInteger(raw.village.points) ? raw.village.points : null,
            population: isInteger(raw.village.pop) ? raw.village.pop : null,
            maxPopulation: isInteger(raw.village.pop_max) ? raw.village.pop_max : null,
            wood: isInteger(raw.village.wood) ? raw.village.wood : null,
            stone: isInteger(raw.village.stone) ? raw.village.stone : null,
            iron: isInteger(raw.village.iron) ? raw.village.iron : null,
            maxStorage: isInteger(raw.village.storage_max) ? raw.village.storage_max : null
        };
    }
}