import { assertInteger } from '@tb-dev/ts-guard';
import { useUnitsStore } from '$renderer/stores/units';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { openPlace } from '$lib/plunder/place';
import { sendAttackFromPlace } from '$lib/plunder/attack';
import { PlunderError } from '$browser/error';
import { PlunderAttackWithLoot } from '$lib/plunder/resources';
import type { DemolitionTroops, StringWallLevel } from '$types/game';
import type { PlunderTargetInfo } from '$browser/lib/plunder/targets';

export async function destroyWall(info: PlunderTargetInfo): Promise<boolean> {
    try {
        // Não faz nada se a muralha não existir.
        if (info.wallLevel === 0) return true;

        // Obtém as unidades necessárias para destruir a muralha.
        const demolitionTemplate = await ipcInvoke('get-demolition-troops-config');
        if (!demolitionTemplate) throw new PlunderError('Could not get demolition troops config.');
        const neededUnits = demolitionTemplate.units[info.wallLevel.toString(10) as StringWallLevel];

        // Verifica se há unidades o suficiente para destruir a muralha.
        const unitStore = useUnitsStore();
        for (const [key, value] of Object.entries(neededUnits) as [keyof DemolitionTroops, number][]) {
            if (unitStore[key] < value) return false;
        };

        await openPlace(info.button.place);
        const sent = await sendAttackFromPlace(neededUnits);

        // Se o ataque foi enviado com sucesso, atualiza o histórico.
        if (sent) {
            const carry = await ipcInvoke('plunder:calc-carry-capacity', neededUnits);
            assertInteger(carry, 'Could not calculate carry capacity when destroying wall.');
            const attack = new PlunderAttackWithLoot(info, carry);
            attack.destroyedWalls = info.wallLevel;
            ipcSend('plunder-attack-sent', attack);
        };

        return sent;

    } catch (err) {
        PlunderError.catch(err);
        return false;
    };
};