export class DefaultPlunderConfig implements PlunderConfigType {
    public readonly active = false;
    public readonly mode = 'single';
    public readonly village = null;
    public readonly group = 0;

    // Ataque
    public readonly maxDistance = 20;
    public readonly ignoreOlderThan = 10;
    public readonly ratio = 0.8;
    public readonly attackDelay = 200;
    public readonly blindAttack = 'never';

    // Modelo C
    public readonly useC = 'never';
    public readonly maxDistanceC = 10;
    public readonly ignoreOlderThanC = 5;
    public readonly useCWhenRatioIsBiggerThan = 3;

    // Grupo
    public readonly fieldsPerWave = 10;
    public readonly villageDelay = 2000;

    // Muralha
    public readonly ignoreWall = false;
    public readonly wallLevelToIgnore = 1;
    public readonly destroyWall = false;
    public readonly wallLevelToDestroy = 1;
    public readonly destroyWallMaxDistance = 20;
    public readonly demolitionTemplate = -1;

    // Outros
    public readonly minutesUntilReload = 10;
    public readonly estimate = 1;
    public readonly pageDelay = 2000;
}

export class DefaultPlunderHistory implements PlunderHistoryType {
    public readonly wood = 0;
    public readonly stone = 0;
    public readonly iron = 0;
    public readonly attackAmount = 0;
    public readonly destroyedWalls = 0;
    public readonly villages = {};
}

export abstract class PlunderAttack implements PlunderAttackLog {
    // Já incluso o ataque enviado.
    public readonly attackAmount: number = 1;
    public destroyedWalls: number = 0;

    public abstract wood: number;
    public abstract stone: number;
    public abstract iron: number;
}

export class PlunderHistoryVillage extends PlunderAttack implements PlunderHistoryVillageType {
    public readonly addedAt: number = new Date().setUTCHours(0, 0, 0, 0);
    public override attackAmount: number = 0;
    public wood: number = 0;
    public stone: number = 0;
    public iron: number = 0;
}