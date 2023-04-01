import type { World } from '$types/game';

export type ErrorLogBase = {
    readonly name: string;
    readonly message: string;
    readonly stack: string | null;
};

export interface ErrorLogType extends ErrorLogBase {
    readonly id: number;
    readonly world: World | null;
    readonly url: string;
    readonly time: number;
    readonly ares: string;
    readonly electron: string;
    readonly chrome: string;
    readonly tribal: string | null;
    readonly locale: string | null;
    readonly pending: boolean;
};

export interface ElectronProcessErrorLogType extends ErrorLogBase {
    readonly id: number;
    readonly time: number;
    readonly ares: string;
    readonly electron: string;
    readonly chrome: string;
    readonly tribal: string | null;
    readonly locale: string | null;
    readonly pending: boolean;
};