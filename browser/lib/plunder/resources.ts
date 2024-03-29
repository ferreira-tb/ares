import { assertInteger } from '$common/guards';
import { resources } from '$common/enum';
import { PlunderAttack } from '$common/templates';
import { usePlunderConfigStore } from '$renderer/stores';
import type { PlunderTargetInfo } from '$browser/lib/plunder/targets';

export class PlunderAttackWithLoot extends PlunderAttack {
    public wood: number;
    public stone: number;
    public iron: number;

    constructor(info: PlunderTargetInfo, carry: number) {
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
            assertInteger(amount, `Resource amount should be an integer, but got ${amount}.`);

            const resName = resources[index];
            this[resName] = Math.ceil(amount * plunderedResourcesRatio);
        });
    };
};