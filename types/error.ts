import type { World } from '$types/game';

export type ErrorLogBase = {
    readonly name: string;
    readonly message: string;
    readonly stack: string | null;
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
    readonly stack: string | null;
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
    readonly stack: string | null;
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