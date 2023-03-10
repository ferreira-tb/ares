import { Deimos } from '$deimos/shared/ipc.js';
import { DeimosError } from '$deimos/shared/error.js';
import { TribalWarsGameData } from '$deimos/models/data.js';
import { PlunderInfo } from '$deimos/models/plunder.js';
import { Units } from '$deimos/models/units.js';

export function setDeimosEvents() {
    Deimos.handle('get-game-data', () => {
        try {
            const rawGameData = TribalWars.getGameData();
            return new TribalWarsGameData(rawGameData);
        } catch (err) {
            DeimosError.catch(err);
            return null;
        };
    });

    Deimos.handle('get-plunder-info', () => {
        try {
            const rawPlunderInfo = Accountmanager.farm;
            return new PlunderInfo(rawPlunderInfo);

        } catch (err) {
            DeimosError.catch(err);
            return null;
        };
    });

    Deimos.handle('get-current-village-units', () => {
        try {
            const rawUnits = Accountmanager.farm.current_units;
            return new Units(rawUnits);
        } catch (err) {
            DeimosError.catch(err);
            return null;
        };
    });
};