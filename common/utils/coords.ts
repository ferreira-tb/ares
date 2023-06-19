/** Calcula distância em campos entre duas coordenadas. */
export function calcDistance(originX: number, originY: number, destX: number, destY: number) {
    return Math.sqrt(((destX - originX) ** 2) + ((destY - originY) ** 2));
};

export function getContinentFromCoords(x: number, y: number, prefix?: string) {
    const a = y.toString(10)[0];
    const b = x.toString(10)[0];
    if (prefix) return `${prefix}${a}${b}`;
    return `${a}${b}`;
};