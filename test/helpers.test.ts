import { assertWorldFromURL, getWorldFromURL, assertCoordsFromTextContent, parseCoordsFromTextContent } from '#/helpers.js';

test('mundo atual', () => {
    const url = new URL('https://br117.tribalwars.com.br/page/stats');
    expect(getWorldFromURL(url)).toBe('br117');

    const url2 = new URL('https://brp6.tribalwars.com.br/page/stats');
    expect(getWorldFromURL(url2)).toBe('brp6');

    const url3 = new URL('https://www.tribalwars.com.br/page/stats');
    expect(getWorldFromURL(url3)).toBe(null);

    const url4 = new URL('https://music.youtube.com/');
    expect(getWorldFromURL(url4)).toBe(null);
});

test('mundo atual (assert)', () => {
    const url = new URL('https://br117.tribalwars.com.br/page/stats');
    expect(() => assertWorldFromURL(url)).not.toThrowError();

    const url2 = new URL('https://www.tribalwars.com.br/page/stats');
    expect(() => assertWorldFromURL(url2)).toThrowError();
});

test('coordenadas', () => {
    const text = 'Aldeias(1391)CoordenadasPontos00 0023 OK 462|52712.154';
    expect(parseCoordsFromTextContent(text)).toEqual([462, 527]);

    const text2 = 'Melhor resultado: ontem (334.212352|55';
    expect(parseCoordsFromTextContent(text2)).toBe(null);
});

test('coordenadas (assert)', () => {
    const text = 'Aldeias(1391)CoordenadasPontos00 0023 OK 462|52712.154';
    expect(() => assertCoordsFromTextContent(text)).not.toThrowError();

    const text2 = 'Melhor resultado: ontem (334.212352|55';
    expect(() => assertCoordsFromTextContent(text2)).toThrowError();
});