import { ref } from 'mechanus';
import { PlunderHistoryVillage } from '$common/templates';

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
        wood: ref<number>(0),
        stone: ref<number>(0),
        iron: ref<number>(0),
        destroyedWalls: ref<number>(0),
        attackAmount: ref<number>(0),
        villages: ref(villages)
    } satisfies MechanusPlunderHistoryStoreType);
};