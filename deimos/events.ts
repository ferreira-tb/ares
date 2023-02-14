import { Deimos } from '$deimos/ipc.js';
import { DeimosError } from '$deimos/error.js';
import type { TribalWarsType } from '$types/deimos.js';

declare const TribalWars: TribalWarsType;

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
            if (typeof gameData.world === 'string' && gameData.world.length > 0) {
                return gameData.world;
            } else {
                return null;
            };
            
        } catch (err) {
            DeimosError.handle(err);
            return null;
        };
    });
};