export class DefaultPlunderConfig implements PlunderConfigType {
    // Painel
    readonly active = false;
    readonly ignoreWall = false;
    readonly destroyWall = false;
    readonly groupAttack = false;
    readonly useC = false;
    readonly ignoreDelay = false;
    readonly blindAttack = false;

    // Ataque
    readonly maxDistance = 20;
    readonly ignoreOlderThan = 10;
    readonly attackDelay = 200;
    readonly resourceRatio = 0.8;
    readonly blindAttackPattern = 'smaller';

    // Modelo C
    readonly useCPattern = 'normal';
    readonly maxDistanceC = 10;
    readonly ignoreOlderThanC = 5;
    readonly useCWhenResourceRatioIsBiggerThan = 3;

    // Grupo
    readonly plunderGroupId = null;
    readonly fieldsPerWave = 10;
    readonly villageDelay = 2000;

    // Muralha
    readonly wallLevelToIgnore = 1;
    readonly wallLevelToDestroy = 1;
    readonly destroyWallMaxDistance = 20;

    // Outros
    readonly minutesUntilReload = 10;
    readonly plunderedResourcesRatio = 1;
    readonly pageDelay = 2000;
};

export class DefaultPlunderHistory implements PlunderHistoryType {
    readonly wood = 0;
    readonly stone = 0;
    readonly iron = 0;
    readonly attackAmount = 0;
    readonly destroyedWalls = 0;
    readonly villages = {};
};

export abstract class PlunderAttack implements PlunderAttackLog {
    // Já incluso o ataque enviado.
    readonly attackAmount: number = 1;
    destroyedWalls: number = 0;

    abstract wood: number;
    abstract stone: number;
    abstract iron: number;
};

export class PlunderHistoryVillage extends PlunderAttack implements PlunderHistoryVillageType {
    readonly addedAt: number = new Date().setUTCHours(0, 0, 0, 0);
    override attackAmount: number = 0;
    wood: number = 0;
    stone: number = 0;
    iron: number = 0;
};