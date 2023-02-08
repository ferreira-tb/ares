import { assert, assertElement, assertFinite, assertInteger, assertType } from "#/error.js";

Document.prototype.queryAndAssert = function<T extends Element>(selector: string): T {
    const element = this.querySelector<T>(selector);
    assertElement(element, selector);
    return element;
};

Document.prototype.queryAsArray = function<T extends Element>(selector: string): T[] {
    const elements = this.querySelectorAll<T>(selector);
    return Array.from(elements);
};

Element.prototype.assertAttribute = function<T extends string>(attribute: string): T {
    const value = this.getAttribute(attribute);
    assertType(typeof value === 'string', `O atributo ${attribute} não existe no elemento.`);
    return value.trim() as T;
};

Element.prototype.assertAttributeAsInt = function(attribute: string, allowNegative = false, radix: number = 10): number {
    const value = this.assertAttribute(attribute);
    const parsed = Number.parseInt(value.trim().replace(/\D/g, ''), radix);
    assertInteger(parsed, 'Não foi possível obter um inteiro a partir do atributo.');

    if (allowNegative === false) {
        const sign = Math.sign(parsed);
        assertType(sign === 1 || sign === 0, 'O número é negativo.');
    };

    return parsed;
};

Element.prototype.assertTextContent = function<T extends string>(): T {
    const content = this.textContent;
    assertType(typeof content === 'string', 'O elemento não possui conteúdo em texto.');
    return content.trim() as T;
};

Element.prototype.parseInt = function(allowNegative = false, radix: number = 10): number {
    const content = this.textContent;
    assertType(typeof content === 'string', 'O elemento não possui conteúdo em texto.');
    const parsed = Number.parseInt(content.trim().replace(/\D/g, ''), radix);
    assertInteger(parsed, 'Não foi possível obter um inteiro a partir do conteúdo em texto do elemento.');

    if (allowNegative === false) {
        const sign = Math.sign(parsed);
        assertType(sign === 1 || sign === 0, 'O número é negativo.');
    };

    return parsed;
};

Element.prototype.parseFloat = function(allowNegative = false): number {
    const content = this.textContent;
    assertType(typeof content === 'string', 'O elemento não possui conteúdo em texto.');
    const parsed = Number.parseFloat(content.trim());
    assertFinite(parsed, 'Não foi possível obter um número de ponto flutuante a partir do conteúdo em texto do elemento.');

    if (allowNegative === false) {
        const sign = Math.sign(parsed);
        assertType(sign === 1 || sign === 0, 'O número é negativo.');
    };

    return parsed;
};

Element.prototype.queryAndAssert = function<T extends Element>(selector: string): T {
    const element = this.querySelector<T>(selector);
    assertElement(element, selector);
    return element;
};

Element.prototype.queryAsArray = function<T extends Element>(selector: string): T[] {
    const elements = this.querySelectorAll<T>(selector);
    return Array.from(elements);
};

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

URLSearchParams.prototype.assert = function<T extends string>(name: string): T {
    const item = this.get(name);
    assert(item !== null, 'O item não existe entre os parâmetros da URL.');
    return item as T;
};

URLSearchParams.prototype.assertAsInteger = function(name: string, radix: number = 10): number {
    const item = this.get(name);
    assertType(typeof item === 'string', 'O item não existe entre os parâmetros da URL.');
    return Number.assertInteger(item, radix);
};