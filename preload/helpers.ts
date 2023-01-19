import { assert } from "@/error.js";

export function getCoordsFromTextContent(text: string | null): [number, number] | null {
    if (!text) return null;

    const targetCoords = text.trim().match(/\d\d\d\|\d\d\d/m);
    if (!targetCoords) return null;

    const coords = targetCoords[0].split('\|')
        .map(value => Number.parseInt(value, 10))
        .filter(value => !Number.isNaN(value));

    assert(coords.length === 2, 'As coordenadas são inválidas.');
    return coords as [number, number];
};

/** Calcula distância em campos entre duas coordenadas. */
export function calcDistance(originX: number, originY: number, destinationX: number, destinationY: number) {
    return Math.sqrt(((destinationX - originX) ** 2) + ((destinationY - originY) ** 2));
};