import { getWorldFromURL } from '#/helpers.js';

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

