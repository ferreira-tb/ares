import { PhobosError } from '$phobos/error.js';
import type { WorldConfigType } from '$types/world.js';

class WorldConfig implements WorldConfigType {
    readonly speed: number;
    readonly unitSpeed: number;
    readonly tradeCancelTime: number;
    readonly commandCancelTime: number;
    readonly archer: boolean;
    readonly church: boolean;
    readonly watchtower: boolean;

    constructor() {
        const speed = document.queryAndAssert('config > speed');
        this.speed = speed.parseFloatStrict();

        const unitSpeed = document.queryAndAssert('config > unit_speed');
        this.unitSpeed = unitSpeed.parseFloatStrict();

        const tradeCancelTime = document.queryAndAssert('misc trade_cancel_time');
        this.tradeCancelTime = tradeCancelTime.parseIntStrict();

        const commandCancelTime = document.queryAndAssert('commands command_cancel_time');
        this.commandCancelTime = commandCancelTime.parseIntStrict();

        const archer = document.queryAndAssert('game > archer');
        this.archer = archer.parseIntStrict() === 1;

        const church = document.queryAndAssert('game > church');
        this.church = church.parseIntStrict() === 1;

        const watchtower = document.queryAndAssert('game > watchtower');
        this.watchtower = watchtower.parseIntStrict() === 1;
    };
};

export async function fetchWorldConfig(port: MessagePort) {
    try {
        const worldConfig = new WorldConfig();
        port.postMessage(worldConfig);

    } catch (err) {
        PhobosError.catch(err);
        port.postMessage(null);
        
    } finally {
        port.close();
    };
};