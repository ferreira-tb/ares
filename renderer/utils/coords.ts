import { RendererProcessError } from '$renderer/error';

/**
 * Analisa o texto contido num elemento a procura de coordenadas válidas.
 * @param text Texto do elemento.
 * @returns Tupla com as coordenadas ou `null` se elas não forem encontradas.
 */
export function parseCoordsFromTextContent(text: string | null): [number, number] | null {
    if (!text) return null;

    const targetCoords = text.trim().match(/\d{3}\|\d{3}/m);
    if (!targetCoords) return null;

    const coords = targetCoords[0].splitAsIntegerListStrict('|');
    if (coords.length !== 2) {
        throw new RendererProcessError('Expected a XY tuple, but got a different length.');
    };
    return coords as [number, number];
};

export function parseCoordsFromTextContentStrict(text: string | null): [number, number] {
    const coords = parseCoordsFromTextContent(text);
    if (!Array.isArray(coords)) {
        throw new RendererProcessError('Could not parse coords from text content.');
    };
    return coords;
};