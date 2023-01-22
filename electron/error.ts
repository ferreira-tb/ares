export class MainProcessError extends Error {
    override readonly name = 'MainProcessError';

    constructor(message: string) {
        super(message);
    };

    public static handle(err: unknown) {
        if (err instanceof Error) console.error(err);
    };
};

export function assert(condition: any, message: string): asserts condition {
    if (!condition) throw new MainProcessError(message);
};

export function assertInteger(item: any, message: string): asserts item is number {
    if (!Number.isInteger(item)) throw new TypeError(message);
};

export function assertFinite(item: any, message: string): asserts item is number {
    if (!Number.isFinite(item)) throw new TypeError(message);
};

export function assertType(condition: any, message: string): asserts condition {
    if (!condition) throw new TypeError(message);
};

/**
 * Compara as propriedades enumeráveis de um objeto com as de outro para determinar se eles possuem exatamente as mesmas.
 * Não há qualquer preocupação com os tipos dos valores contidos nessas propriedades.
 * @param reference Objeto de referência.
 * @param item Item que será checado.
 */
export function assertObjectHasSameProps<T extends object>(reference: T, item: any): asserts item is T {
    assertType(reference && typeof reference === 'object', 'A referência não é um objeto.');
    assertType(item && typeof item === 'object', 'O item não é um objeto.');

    const referenceKeys = new Set(Object.keys(reference));
    const itemKeys = new Set(Object.keys(item));

    assert(referenceKeys.size > 0, 'O objeto de referência não possui propriedades.');
    assert(itemKeys.size > 0, 'O item não possui propriedades.');
    assert(referenceKeys.size === itemKeys.size, 'Um objeto possui mais propriedades que o outro.');

    for (const value of referenceKeys.values()) {
        assert(itemKeys.has(value), 'Os objetos possuem propriedades diferentes');
    };
};