import { assertInteger } from '$shared/guards';
import { DeimosModelError } from '$deimos/interface/error';

export class TribalWarsTiming implements TribalWarsTimingType {
    readonly addedServerTime: number;
    readonly initialServerTime: number;
    readonly isReady: boolean;
    readonly offsetFromServer: number;
    readonly offsetToServer: number;
    readonly paused: boolean;
    readonly tickInterval: number;

    constructor(timing: RawTiming) {
        assertInteger(timing.added_server_time, 'added_server_time is not an integer');
        this.addedServerTime = timing.added_server_time;

        assertInteger(timing.initial_server_time, 'initial_server_time is not an integer');
        this.initialServerTime = timing.initial_server_time;

        if (typeof timing.is_ready !== 'boolean') throw new DeimosModelError('is_ready is not a boolean');
        this.isReady = timing.is_ready;

        assertInteger(timing.offset_from_server, 'offset_from_server is not an integer');
        this.offsetFromServer = timing.offset_from_server;

        assertInteger(timing.offset_to_server, 'offset_to_server is not an integer');
        this.offsetToServer = timing.offset_to_server;

        if (typeof timing.paused !== 'boolean') throw new DeimosModelError('paused is not a boolean');
        this.paused = timing.paused;

        assertInteger(timing.tick_interval, 'tick_interval is not an integer');
        this.tickInterval = timing.tick_interval;
    };
};