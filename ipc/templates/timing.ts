import { isInteger } from 'lodash-es';
import { IpcTribalError } from '$ipc/interface/error';

export class TribalWarsTiming implements TribalWarsTimingType {
    public readonly addedServerTime: number;
    public readonly initialServerTime: number;
    public readonly isReady: boolean;
    public readonly offsetFromServer: number;
    public readonly offsetToServer: number;
    public readonly paused: boolean;
    public readonly tickInterval: number;

    constructor(timing: RawTiming) {
        if (!isInteger(timing.added_server_time)) {
            throw new IpcTribalError('added_server_time is not an integer');
        }
        this.addedServerTime = timing.added_server_time;

        if (!isInteger(timing.initial_server_time)) {
            throw new IpcTribalError('initial_server_time is not an integer');
        }
        this.initialServerTime = timing.initial_server_time;

        if (typeof timing.is_ready !== 'boolean') {
            throw new IpcTribalError('is_ready is not a boolean');
        }
        this.isReady = timing.is_ready;

        if (!isInteger(timing.offset_from_server)) {
            throw new IpcTribalError('offset_from_server is not an integer');
        }
        this.offsetFromServer = timing.offset_from_server;

        if (!isInteger(timing.offset_to_server)) {
            throw new IpcTribalError('offset_to_server is not an integer');
        }
        this.offsetToServer = timing.offset_to_server;

        if (typeof timing.paused !== 'boolean') {
            throw new IpcTribalError('paused is not a boolean');
        }
        this.paused = timing.paused;

        if (!isInteger(timing.tick_interval)) {
            throw new IpcTribalError('tick_interval is not an integer');
        }
        this.tickInterval = timing.tick_interval;
    }
}