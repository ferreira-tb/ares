import { isString, assertString } from '@tb-dev/ts-guard';
import { Deimos } from '$deimos/shared/ipc.js';
import { DeimosError } from '$deimos/shared/error.js';
import { TribalWarsGameData } from '$deimos/models/data';

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

    Deimos.handle('get-world', () => {
        try {
            const gameData = TribalWars.getGameData();
            if (isString(gameData.world)) return gameData.world;
            return null;
            
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