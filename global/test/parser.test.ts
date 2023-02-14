import { assertCoordsFromTextContent, parseCoordsFromTextContent } from '$global/utils/parser.js';

// Testa se as coordenadas são obtidas corretamente.
test('coordenadas', () => {
    const text = 'Aldeias(1391)CoordenadasPontos00 0023 OK 462|52712.154';
    expect(parseCoordsFromTextContent(text)).toEqual([462, 527]);

    const text2 = 'Melhor resultado: ontem (334.212352|55';
    expect(parseCoordsFromTextContent(text2)).toBe(null);
});

// Testa se as coordenadas são obtidas corretamente e se um erro é emitido caso não seja possível determiná-las.
test('coordenadas (assert)', () => {
    const text = 'Aldeias(1391)CoordenadasPontos00 0023 OK 462|52712.154';
    expect(() => assertCoordsFromTextContent(text)).not.toThrowError();

    const text2 = 'Melhor resultado: ontem (334.212352|55';
    expect(() => assertCoordsFromTextContent(text2)).toThrowError();
});