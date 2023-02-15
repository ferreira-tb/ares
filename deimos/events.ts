import { Deimos } from '$deimos/ipc.js';
import { DeimosError } from '$deimos/error.js';
import { isString, assertString } from '@tb-dev/ts-guard';

export function setDeimosEvents() {
    Deimos.handle('get-game-data', () => {
        try {
            return TribalWars.getGameData()
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