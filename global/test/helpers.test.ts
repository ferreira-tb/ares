import {
    assertWorldFromURL,
    getWorldFromURL,
    assertCoordsFromTextContent,
    parseCoordsFromTextContent,
    isFarmUnit
} from '$global/helpers.js';

// Testa se o mundo atual é obtido corretamente.
test('mundo atual', () => {
    const url = new URL('https://br117.tribalwars.com.br/page/stats');
    expect(getWorldFromURL(url)).toBe('br117');

    const url2 = new URL('https://brp6.tribalwars.com.br/page/stats');
    expect(getWorldFromURL(url2)).toBe('brp6');

    const url3 = new URL('https://www.tribalwars.com.br/page/stats');
    expect(getWorldFromURL(url3)).toBe(null);

    const url4 = new URL('https://music.youtube.com/');
    expect(getWorldFromURL(url4)).toBe(null);

    const url5 = new URL('http://br120.tribalwars.com.br/game.php?screen=am_farm');
    expect(getWorldFromURL(url5)).toBe('br120');
});

// Testa se o mundo atual é obtido corretamente e se um erro é emitido caso não seja possível determiná-lo.
test('mundo atual (assert)', () => {
    const url = new URL('https://br117.tribalwars.com.br/page/stats');
    expect(() => assertWorldFromURL(url)).not.toThrowError();

    const url2 = new URL('https://www.tribalwars.com.br/page/stats');
    expect(() => assertWorldFromURL(url2)).toThrowError();
});

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

// Testa se as unidades de farm são identificadas corretamente.
test('unidades de farm', () => {
    expect(isFarmUnit('spear')).toBe(true);
    expect(isFarmUnit('sword')).toBe(true);
    expect(isFarmUnit('axe')).toBe(true);
    expect(isFarmUnit('archer')).toBe(true);
    expect(isFarmUnit('spy')).toBe(true);
    expect(isFarmUnit('light')).toBe(true);
    expect(isFarmUnit('marcher')).toBe(true);
    expect(isFarmUnit('heavy')).toBe(true);
    expect(isFarmUnit('knight')).toBe(true);

    expect(isFarmUnit('catapult')).toBe(false);
    expect(isFarmUnit('ram')).toBe(false);
    expect(isFarmUnit('snob')).toBe(false);
    expect(isFarmUnit('militia')).toBe(false);
});