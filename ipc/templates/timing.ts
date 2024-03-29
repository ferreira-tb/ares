import { assertInteger } from '$common/guards';
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
        assertInteger(timing.added_server_time, 'added_server_time is not an integer');
        this.addedServerTime = timing.added_server_time;

        assertInteger(timing.initial_server_time, 'initial_server_time is not an integer');
        this.initialServerTime = timing.initial_server_time;

        if (typeof timing.is_ready !== 'boolean') throw new IpcTribalError('is_ready is not a boolean');
        this.isReady = timing.is_ready;

        assertInteger(timing.offset_from_server, 'offset_from_server is not an integer');
        this.offsetFromServer = timing.offset_from_server;

        assertInteger(timing.offset_to_server, 'offset_to_server is not an integer');
        this.offsetToServer = timing.offset_to_server;

        if (typeof timing.paused !== 'boolean') throw new IpcTribalError('paused is not a boolean');
        this.paused = timing.paused;

        assertInteger(timing.tick_interval, 'tick_interval is not an integer');
        this.tickInterval = timing.tick_interval;
    };
};