import { assertInteger } from '@tb-dev/ts-guard';
import { resources } from '$global/utils/constants.js';
import type { PlunderVillageInfo } from '$lib/farm/villages.js';

export class PlunderedResources {
    wood: number;
    stone: number;
    iron: number;

    constructor(info: PlunderVillageInfo, carry: number) {
        this.wood = info.res.wood;
        this.stone = info.res.stone;
        this.iron = info.res.iron;

        // Atribuir Infinity impede divisões por zero.
        let total = this.wood + this.stone + this.iron;
        if (total === 0) total = Infinity;

        [this.wood, this.stone, this.iron].forEach((amount, index) => {
            // Se houver mais recursos do que a carga suporta, calcula quanto de cada recurso deve ser saqueado.
            if (total > carry) amount = Math.floor((amount / total) * carry);
            assertInteger(amount, 'A quantidade de recursos esperada não é válida.');

            const resName = resources[index];
            this[resName] = amount;     
        });
    };
};