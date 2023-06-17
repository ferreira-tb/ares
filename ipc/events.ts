import { IpcTribal, IpcTribalError } from '$ipc/interface';
import { PlunderInfo, TribalWarsGameData, TribalWarsTiming, Units } from '$ipc/templates';

export function setIpcTribalEvents() {
    IpcTribal.on('ipc-tribal:ui-error-message', (message: string) => UI.ErrorMessage(message));
    IpcTribal.on('ipc-tribal:ui-info-message', (message: string) => UI.InfoMessage(message));
    IpcTribal.on('ipc-tribal:ui-success-message', (message: string) => UI.SuccessMessage(message));

    IpcTribal.handle('ipc-tribal:current-village-units', () => {
        try {
            const rawUnits = Accountmanager.farm.current_units;
            return new Units(rawUnits);
        } catch (err) {
            IpcTribalError.catch(err);
            return null;
        };
    });

    IpcTribal.handle('get-game-data', () => {
        try {
            const rawGameData = TribalWars.getGameData();
            return new TribalWarsGameData(rawGameData);
        } catch (err) {
            IpcTribalError.catch(err);
            return null;
        };
    });

    IpcTribal.handle('ipc-tribal:incoming-attacks', () => {
        try {
            const incomingAttacks = TribalWars.getGameData().player.incomings;
            return Number.parseIntStrict(incomingAttacks);
        } catch (err) {
            IpcTribalError.catch(err);
            return null;
        };
    });

    IpcTribal.handle('ipc-tribal:plunder-info', () => {
        try {
            const rawPlunderInfo = Accountmanager.farm;
            return new PlunderInfo(rawPlunderInfo);
        } catch (err) {
            IpcTribalError.catch(err);
            return null;
        };
    });

    IpcTribal.handle('get-response-time', () => {
        try {
            const responseTime = Timing.offset_to_server;
            if (!Number.isInteger(responseTime)) throw new IpcTribalError('Failed to get response time');
            return responseTime;
        } catch (err) {
            IpcTribalError.catch(err);
            return null;
        };
    });

    IpcTribal.handle('ipc-tribal:timing', () => {
        try {
            return new TribalWarsTiming(Timing);
        } catch (err) {
            IpcTribalError.catch(err);
            return null;
        };
    });
};