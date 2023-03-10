import { assertInteger } from '@tb-dev/ts-guard';
import { resources } from '$global/utils/constants.js';
import { PlunderAttack } from '$lib/plunder/attack.js';
import { usePlunderConfigStore } from '$vue/stores/plunder.js';
import type { PlunderVillageInfo } from '$lib/plunder/villages.js';

export class PlunderAttackWithLoot extends PlunderAttack {
    override wood: number;
    override stone: number;
    override iron: number;

    constructor(info: PlunderVillageInfo, carry: number) {
        super();

        this.wood = info.res.wood;
        this.stone = info.res.stone;
        this.iron = info.res.iron;

        // Atribuir Infinity impede divisões por zero.
        let total = this.wood + this.stone + this.iron;
        if (total === 0) total = Infinity;

        const { plunderedResourcesRatio } = usePlunderConfigStore();
        [this.wood, this.stone, this.iron].forEach((amount, index) => {
            // Se houver mais recursos do que a carga suporta, calcula quanto de cada recurso deve ser saqueado.
            if (total > carry) amount = Math.ceil((amount / total) * carry);
            assertInteger(amount, 'A quantidade de recursos esperada não é válida.');

            const resName = resources[index];
            this[resName] = Math.ceil(amount * plunderedResourcesRatio);
        });
    };
};