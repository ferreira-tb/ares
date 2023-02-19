import type { World } from '$types/game.js';

export type ErrorLogBase = {
    readonly name: string;
    readonly message: string;
};

export interface ErrorLogType extends ErrorLogBase {
    readonly id: number;
    readonly world: World | null;
    readonly time: number;
    readonly ares: string;
    readonly electron: string;
    readonly chrome: string;
    readonly tribal: string | null;
    readonly pending: boolean;
}

export type DOMErrorLogBase = {
    readonly selector: string;
};

export interface DOMErrorLogType extends DOMErrorLogBase {
    readonly id: number;
    readonly url: string;
    readonly world: World | null;
    readonly time: number;
    readonly ares: string;
    readonly electron: string;
    readonly chrome: string;
    readonly tribal: string | null;
    readonly pending: boolean;
}