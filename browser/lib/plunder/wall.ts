import { assertObject, assertInteger } from '@tb-dev/ts-guard';
import { useUnitsStore } from '$vue/stores/units.js';
import { ipcInvoke, ipcSend } from '$global/ipc.js';
import { openPlace } from '$lib/plunder/place.js';
import { sendAttackFromPlace } from '$lib/plunder/attack.js';
import { PlunderError } from '$browser/error.js';
import { PlunderAttackWithLoot } from '$lib/plunder/resources.js';
import type { DemolitionTroops, StringWallLevel } from '$types/game.js';
import type { PlunderVillageInfo } from '$lib/plunder/villages.js';

export async function destroyWall(info: PlunderVillageInfo): Promise<boolean> {
    try {
        // Não faz nada se a muralha não existir.
        if (info.wallLevel === 0) return true;

        // Obtém as unidades necessárias para destruir a muralha.
        const demolitionTemplate = await ipcInvoke('get-demolition-troops-config');
        assertObject(demolitionTemplate, 'Não foi possível obter a configuração de tropas de demolição.');
        const neededUnits: DemolitionTroops = demolitionTemplate.units[info.wallLevel.toString(10) as StringWallLevel];
        assertObject(neededUnits, 'Não foi possível obter as unidades necessárias para destruir a muralha.');

        // Verifica se há unidades o suficiente para destruir a muralha.
        const unitStore = useUnitsStore();
        for (const [key, value] of Object.entries(neededUnits) as [keyof DemolitionTroops, number][]) {
            if (unitStore[key] < value) return false;
        };

        await openPlace(info.button.place);
        const status = await sendAttackFromPlace(neededUnits);

        // Se o ataque foi enviado com sucesso, atualiza o histórico.
        if (status === true) {
            const carry = await ipcInvoke('calc-carry-capacity', neededUnits);
            assertInteger(carry, 'Não foi possível calcular a capacidade de carga.');
            const attack = new PlunderAttackWithLoot(info, carry);
            attack.destroyedWalls = info.wallLevel;
            ipcSend('plunder-attack-sent', attack);
        };

        return status;

    } catch (err) {
        PlunderError.catch(err);
        return false;
    };
};