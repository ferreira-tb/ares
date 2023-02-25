// Remove os métodos de um objeto.
export type NonFunctionKeyNames<T> = Exclude<{
    [key in keyof T]: T[key] extends Function ? never : key;
}[keyof T], undefined>;

export type RemoveMethods<T> = Pick<T, NonFunctionKeyNames<T>>;

// Número para string.
export type NumberToString<N extends number> = `${N}`;

// Range de números inteiros.
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

/** Range de números inteiros. `F` é inclusivo e `T` é exclusivo. */
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
/** Range de números inteiros convertidos para strings. `F` é inclusivo e `T` é exclusivo. */
export type IntRangeToStrings<F extends number, T extends number> = NumberToString<IntRange<F, T>>;