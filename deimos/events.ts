import { assertInteger } from '$global/guards';
import { Deimos } from '$deimos/interface/ipc';
import { DeimosError } from '$deimos/interface/error';
import { TribalWarsGameData } from '$deimos/models/data';
import { PlunderInfo } from '$deimos/models/plunder';
import { Units } from '$deimos/models/units';
import { TribalWarsTiming } from '$deimos/models/timing';

export function setDeimosEvents() {
    Deimos.on('show-ui-error-message', (message: string) => UI.ErrorMessage(message));
    Deimos.on('show-ui-info-message', (message: string) => UI.InfoMessage(message));
    Deimos.on('show-ui-success-message', (message: string) => UI.SuccessMessage(message));

    Deimos.handle('get-timing', () => {
        try {
            return new TribalWarsTiming(Timing);
        } catch (err) {
            DeimosError.catch(err);
            return null;
        };
    });

    Deimos.handle('get-response-time', () => {
        try {
            const responseTime = Timing.offset_to_server;
            assertInteger(responseTime, 'Failed to get response time');
            return responseTime;
        } catch (err) {
            DeimosError.catch(err);
            return null;
        };
    });

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