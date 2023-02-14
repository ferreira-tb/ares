import { DeimosError } from '$deimos/error.js';

export function assert(condition: any, message: string): asserts condition {
    if (!condition) throw new DeimosError(message);
};

export function assertType(condition: any, message: string): asserts condition {
    if (!condition) throw new TypeError(message);
};