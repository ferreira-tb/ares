import { assertInteger } from "#/error.js";
import { resources as resourceList } from '#/constants.js';
import type { PlunderVillageInfo } from "$/farm/villages.js";

export class ExpectedResources {
    wood: number;
    stone: number;
    iron: number;

    constructor(info: PlunderVillageInfo, carry: number) {
        this.wood = info.wood;
        this.stone = info.stone;
        this.iron = info.iron;

        // Atribuir Infinity impede divisões por zero.
        let total = this.wood + this.stone + this.iron;
        if (total === 0) total = Infinity;

        [this.wood, this.stone, this.iron].forEach((amount, index) => {
            // Se houver mais recursos do que a carga suporta, calcula quanto de cada recurso deve ser saqueado.
            if (total > carry) amount = Math.floor((amount / total) * carry);
            assertInteger(amount, 'A quantidade de recursos esperada não é válida.');

            const resName = resourceList[index];
            this[resName] = amount;
            
        }, this);
    };
};