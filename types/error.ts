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
    readonly locale: string | null;
    readonly pending: boolean;
}

export type DOMErrorLogBase = {
    readonly name: string;
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
    readonly locale: string | null;
    readonly pending: boolean;
};

export type MainProcessErrorLogBase = {
    readonly name: string;
    readonly message: string;
};

export interface MainProcessErrorLogType extends MainProcessErrorLogBase {
    readonly id: number;
    readonly time: number;
    readonly ares: string;
    readonly electron: string;
    readonly chrome: string;
    readonly tribal: string | null;
    readonly locale: string | null;
    readonly pending: boolean;
};