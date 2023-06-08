import { ref } from 'mechanus';
import { positiveIntegerRef } from '$electron/utils/mechanus';
import { PlunderHistoryVillage } from '$common/templates/plunder';

const villages = new Proxy({} as PlunderHistoryType['villages'], {
    get(target, villageId): PlunderHistoryVillageType[] {
        if (typeof villageId !== 'string') villageId = String(villageId);
        if (!(villageId in target) && !Number.isNaN(Number.parseInt(villageId, 10))) {
            target[villageId] = [new PlunderHistoryVillage()];
        };
        
        return Reflect.get(target, villageId);
    }
});

export function definePlunderHistoryStore(mechanus: Mechanus) {
    return mechanus.define('plunder-history', {
        wood: ref<number>(0, positiveIntegerRef),
        stone: ref<number>(0, positiveIntegerRef),
        iron: ref<number>(0, positiveIntegerRef),
        destroyedWalls: ref<number>(0, positiveIntegerRef),
        attackAmount: ref<number>(0, positiveIntegerRef),
        villages: ref(villages)
    } satisfies MechanusPlunderHistoryStoreType);
};