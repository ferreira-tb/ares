import { assert, assertInteger } from '$electron/error.js';

Map.prototype.assert = function<K, V>(key: K, message?: string): V {
    const item = this.get(key);
    if (typeof message !== 'string') message = 'O item não existe no mapa.';
    assert(item !== undefined, message);
    return item;
};

Number.assertInteger = function(rawString: string, radix: number = 10): number {
    const parsed = Number.parseInt(rawString, radix);
    assertInteger(parsed, 'Não foi possível obter um número inteiro a partir da string.');
    return parsed;
};