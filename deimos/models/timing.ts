import { assertBoolean, assertInteger } from '@tb-dev/ts-guard';
import type { TribalWarsTimingType } from '$types/game';
import type { RawTiming } from '$types/deimos';

export class TribalWarsTiming implements TribalWarsTimingType {
    readonly addedServerTime: number;
    readonly initialServerTime: number;
    readonly isReady: boolean;
    readonly offsetFromServer: number;
    readonly offsetToServer: number;
    readonly paused: boolean;
    readonly tickInterval: number;

    constructor(timing: RawTiming) {
        assertInteger(timing.added_server_time);
        this.addedServerTime = timing.added_server_time;

        assertInteger(timing.initial_server_time);
        this.initialServerTime = timing.initial_server_time;

        assertBoolean(timing.is_ready);
        this.isReady = timing.is_ready;

        assertInteger(timing.offset_from_server);
        this.offsetFromServer = timing.offset_from_server;

        assertInteger(timing.offset_to_server);
        this.offsetToServer = timing.offset_to_server;

        assertBoolean(timing.paused);
        this.paused = timing.paused;

        assertInteger(timing.tick_interval);
        this.tickInterval = timing.tick_interval;
    };
};