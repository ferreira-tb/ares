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