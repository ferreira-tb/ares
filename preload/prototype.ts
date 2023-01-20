import { assertElement, assertFinite, assertInteger, assertType } from "@/error.js";

Document.prototype.queryAndAssert = function(selector: string): Element {
    const element = this.querySelector(selector);
    assertElement(element, selector);
    return element;
};

Document.prototype.queryAsArray = function(selector: string): Element[] {
    const elements = this.querySelectorAll(selector);
    return Array.from(elements);
};

Element.prototype.assertAttribute = function(attribute: string): string {
    const value = this.getAttribute(attribute);
    assertType(typeof value === 'string', `O atributo ${attribute} não existe no elemento.`);
    return value;
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

Element.prototype.queryAndAssert = function(selector: string): Element {
    const element = this.querySelector(selector);
    assertElement(element, selector);
    return element;
};

Element.prototype.queryAsArray = function(selector: string): Element[] {
    const elements = this.querySelectorAll(selector);
    return Array.from(elements);
};