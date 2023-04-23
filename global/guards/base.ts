export const isInstanceOf = <T>(value: unknown, constructor: new (...args: any[]) => T): value is T => value instanceof constructor;
export function assertInstanceOf<T>(value: unknown, constructor: new (...args: any[]) => T, message: string): asserts value is T {
    if (!isInstanceOf(value, constructor)) throw new TypeError(message);
};

export const isString = (value: unknown): value is string => (typeof value === 'string' && value.length > 0);
export function assertString(value: unknown, message: string): asserts value is string {
    if (!isString(value)) throw new TypeError(message);
};

export const isInteger = (value: unknown): value is number => Number.isInteger(value);
export function assertInteger(value: unknown, message: string): asserts value is number {
    if (!isInteger(value)) throw new TypeError(message);
};

export const isFiniteNumber = (value: unknown): value is number => Number.isFinite(value);
export function assertFinite(value: unknown, message: string): asserts value is number {
    if (!isFiniteNumber(value)) throw new TypeError(message);
};