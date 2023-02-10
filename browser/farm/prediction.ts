import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import { assertType } from '$global/error.js';
import { useAresStore } from '$vue/stores/store.js';
import type { PlunderTemplate } from '$browser/farm/templates.js';
import type { DeimosEndpoint, DeimosReport } from '$types/deimos.js';
import type { PlunderVillageInfo } from '$browser/farm/villages.js';
import type { TemplateLoot } from '$browser/types.js';

async function predict(carry: number, villageInfo: PlunderVillageInfo): Promise<number> {
    const aresStore = useAresStore();
    const { currentX, currentY, currentWorld } = storeToRefs(aresStore);

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
    
    const endpoint = inject<DeimosEndpoint>('deimos-endpoint');
    assertType(typeof endpoint === 'string', 'É preciso indicar o endpoint do Deimos.');

    const response = await fetch(`${endpoint}/plunder/predict/${currentWorld.value}`, {
        method: 'post',
        body: JSON.stringify(deimos)
    });

    const prediction = await response.json() as unknown;
    assertType(typeof prediction === 'number', 'Erro ao prever o saque.');
    return prediction;
};

export async function predictBestTemplate(templates: PlunderTemplate[], info: PlunderVillageInfo): Promise<TemplateLoot> {
    assert(templates.length > 0, 'Não há modelos de saque disponíveis.');

    // Prevê o saque para cada modelo.
    const predictions = await Promise.all(templates.map(async (template) => {
        const loot = await predict(template.carry, info);
        return { template, loot };
    }));
    
    // Obtêm o modelo com a melhor previsão.
    return predictions.reduce((prev, curr) => {
        return prev.loot > curr.loot ? prev : curr;
    });
};