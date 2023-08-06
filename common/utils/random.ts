/** Gera um número inteiro entre dois outros. */
export function generateIntegerBetween(min: number, max: number) {
    return Math.floor((Math.random() * (max - min)) + min);
}

/**
 * Gera um número inteiro aleatório com base em um valor e um intervalo.
 * @param base Valor base.
 * @param range Intervalo.
 */
export function generateRandomDelay(base: number, range?: number) {
    if (typeof range !== 'number' || !Number.isInteger(range)) range = 50;
    return generateIntegerBetween(base - range, base + range);
}