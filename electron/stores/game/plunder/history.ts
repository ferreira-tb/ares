import { ref } from 'mechanus';
import { DefaultPlunderHistory, PlunderHistoryVillage } from '$common/templates';

export function definePlunderHistoryStore(mechanus: Mechanus) {
    const history = new DefaultPlunderHistory();

    return mechanus.define('plunder-history', () => {
        const wood = ref<number>(history.wood);
        const stone = ref<number>(history.stone);
        const iron = ref<number>(history.iron);
        const destroyedWalls = ref<number>(history.destroyedWalls);
        const attackAmount = ref<number>(history.attackAmount);
        const villages = ref<PlunderHistoryType['villages']>(proxifyVillages());

        /** Retorna uma versão proxificada e vazia do objeto `villages`. */
        function proxifyVillages() {
            return new Proxy({} as PlunderHistoryType['villages'], {
                get(target, villageId): PlunderHistoryVillageType[] {
                    if (typeof villageId !== 'string') villageId = String(villageId);
                    if (!(villageId in target) && !Number.isNaN(Number.parseInt(villageId, 10))) {
                        target[villageId] = [new PlunderHistoryVillage()];
                    };
                    
                    return Reflect.get(target, villageId);
                }
            });
        };

        /** Retorna uma versão não proxificada do objeto `villages` presente na store. */
        function unproxifyVillages() {
            return { ...villages.value };
        };

        return {
            wood,
            stone,
            iron,
            destroyedWalls,
            attackAmount,
            villages,

            proxifyVillages,
            unproxifyVillages
        };
    });
};