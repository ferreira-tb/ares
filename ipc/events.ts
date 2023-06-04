import { IpcTribal, IpcTribalError } from '$ipc/interface';
import { PlunderInfo, TribalWarsGameData, TribalWarsTiming, Units } from '$ipc/models';

export function setDeimosEvents() {
    IpcTribal.on('show-ui-error-message', (message: string) => UI.ErrorMessage(message));
    IpcTribal.on('show-ui-info-message', (message: string) => UI.InfoMessage(message));
    IpcTribal.on('show-ui-success-message', (message: string) => UI.SuccessMessage(message));

    IpcTribal.handle('get-current-village-units', () => {
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

    IpcTribal.handle('get-incoming-attacks', () => {
        try {
            const incomingAttacks = TribalWars.getGameData().player.incomings;
            return Number.parseIntStrict(incomingAttacks);
        } catch (err) {
            IpcTribalError.catch(err);
            return null;
        };
    });

    IpcTribal.handle('get-plunder-info', () => {
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

    IpcTribal.handle('get-timing', () => {
        try {
            return new TribalWarsTiming(Timing);
        } catch (err) {
            IpcTribalError.catch(err);
            return null;
        };
    });
};