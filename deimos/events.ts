import { assertString } from '@tb-dev/ts-guard';
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
            DeimosError.handle(err);
            return null;
        };
    });

    Deimos.handle('get-plunder-info', () => {
        try {
            const rawPlunderInfo = Accountmanager.farm;
            return new PlunderInfo(rawPlunderInfo);

        } catch (err) {
            DeimosError.handle(err);
            return null;
        };
    });

    Deimos.handle('get-current-village-units', () => {
        try {
            const rawUnits = Accountmanager.farm.current_units;
            return new Units(rawUnits);
        } catch (err) {
            DeimosError.handle(err);
            return null;
        };
    });

    Deimos.on('show-ui-error-message', (message: string) => {
        try {
            assertString(message);
            UI.ErrorMessage(message);
        } catch (err) {
            DeimosError.handle(err);
        };
    });

    Deimos.on('show-ui-info-message', (message: string) => {
        try {
            assertString(message);
            UI.InfoMessage(message);
        } catch (err) {
            DeimosError.handle(err);
        };
    });

    Deimos.on('show-ui-success-message', (message: string) => {
        try {
            assertString(message);
            UI.SuccessMessage(message);
        } catch (err) {
            DeimosError.handle(err);
        };
    });
};