import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import { assertType } from '#/error.js';
import { useAresStore } from '#/vue/stores/store.js';
import type { DeimosEndpoint, DeimosReport } from '@/deimos.js';
import type { PlunderVillageInfo } from '$/farm/villages';

const aresStore = useAresStore();
const { currentX, currentY, currentWorld } = storeToRefs(aresStore);

export async function predict(carry: number, villageInfo: PlunderVillageInfo): Promise<number> {
    assertType(typeof currentWorld.value === 'string', 'É preciso indicar o mundo ao se fazer previsões.');

    const deimos: DeimosReport = {
        expected: villageInfo.res.total,
        carry: carry,
        origin_x: currentX.value,
        origin_y: currentY.value,
        dest_x: villageInfo.coords.x,
        dest_y: villageInfo.coords.y,
        minutes_since: villageInfo.minutesSince
    };
    
    const endpoint = inject<DeimosEndpoint>('deimos-endpoint', 'http://127.0.0.1:8000/deimos');
    const response = await fetch(`${endpoint}/plunder/predict/${currentWorld.value}`, {
        method: 'post',
        body: JSON.stringify(deimos)
    });

    const prediction = await response.json() as unknown;
    assertType(typeof prediction === 'number', 'Erro ao prever o saque.');
    return prediction;
};