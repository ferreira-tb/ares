import { isString, isInstanceOf } from '$shared/guards';

declare global {
    interface Document {
        /**
         * Returns the first element that is a descendant of node that matches selectors.
         * Throws an error if no element is found.
         * @param selector CSS selector to match.
         */
        queryAndAssert<T extends Element>(selector: string): T;
        /**
         * Query all element descendants of node that match selectors, then create an array from the result.
         * The values of the array can be customized by providing a `valueSelector` function.
         * Defaults to the element itself.
         * @param selector CSS selector to match.
         */
        queryAsArray<T = Element>(selector: string, valueSelector?: (element: Element) => T): T[];
        /**
         * Query all element descendants of node that match selectors, then create a `Set` from the result.
         * The values of the set can be customized by providing a `valueSelector` function.
         * Defaults to the element itself.
         * @param selector CSS selector to match.
         */
        queryAsSet<T = Element>(selector: string, valueSelector?: (element: Element) => T): Set<T>;
        /**
         * Returns all element descendants of node that match selectors.
         * However, unlike `querySelectorAll`, this method returns a `Map` instead of a `NodeList`.
         * 
         * The keys of the map are determined by the `keySelector` function that must be provided.
         * @param selector CSS selector to match.
         * @param keySelector Function that returns the key for each element.
         */
        queryAsMap<T extends Element, K>(selector: string, keySelector: (element: T) => K): Map<K, T>;
    }

    interface Element {
        /**
         * Returns element's first attribute whose qualified name is `qualifiedName`.
         * However, unlike `getAttribute`, throws an error if the attribute is not found.
         * @param qualifiedName Attribute to search for.
         */
        getAttributeStrict<T extends string>(qualifiedName: string): T;
        /**
         * Returns element's first attribute whose qualified name is `qualifiedName`, throwing an error if the attribute is not found.
         * The tries to parse the attribute as a floating point number. If the parsing fails, an error is thrown.
         * @param qualifiedName Attribute to search for.
         * @param allowNegative Determines whether negative numbers are allowed.
         * This will throw an error if the parsed number is negative and this parameter is set to `false`.
         * It defaults to `false`.
         */
        getAttributeAsFloatStrict(qualifiedName: string, allowNegative?: boolean): number;
        /**
         * Returns element's first attribute whose qualified name is `qualifiedName`, throwing an error if the attribute is not found.
         * The tries to parse the attribute as an integer. If the parsing fails, an error is thrown.
         * @param qualifiedName Attribute to search for.
         * @param radix A value between 2 and 36 that specifies the base of the number in string.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal. All other strings are considered decimal.
         * @param allowNegative Determines whether negative numbers are allowed.
         * This will throw an error if the parsed number is negative and this parameter is set to `false`.
         * It defaults to `false`.
         */
        getAttributeAsIntStrict(qualifiedName: string, radix?: number, allowNegative?: boolean): number;
        /** Returns the text content of the element, throwing an error if it has no text content. */
        getTextContentStrict<T extends string>(): T;
        /** Tries to parse the text content of the element as an integer. If the parsing fails, an error is thrown. */
        parseIntStrict(radix?: number, allowNegative?: boolean): number;
        /** Tries to parse the text content of the element as a floating point number. If the parsing fails, an error is thrown. */
        parseFloatStrict(allowNegative?: boolean): number;
        /**
         * Returns the first element that is a descendant of node that matches selectors.
         * Throws an error if no element is found.
         * @param selector CSS selector to match.
         */
        queryAndAssert<T extends Element>(selector: string): T;
        /**
         * Query all element descendants of node that match selectors, then create an array from the result.
         * The values of the array can be customized by providing a `valueSelector` function.
         * Defaults to the element itself.
         * @param selector CSS selector to match.
         */
        queryAsArray<T = Element>(selector: string, valueSelector?: (element: Element) => T): T[];
        /**
         * Query all element descendants of node that match selectors, then create a `Set` from the result.
         * The values of the set can be customized by providing a `valueSelector` function.
         * Defaults to the element itself.
         * @param selector CSS selector to match.
         */
        queryAsSet<T = Element>(selector: string, valueSelector?: (element: Element) => T): Set<T>;
        /**
         * Returns all element descendants of node that match selectors.
         * However, unlike `querySelectorAll`, this method returns a `Map` instead of a `NodeList`.
         * 
         * The keys of the map are determined by the `keySelector` function that must be provided.
         * @param selector CSS selector to match.
         * @param keySelector Function that returns the key for each element.
         */
        queryAsMap<T extends Element, K>(selector: string, keySelector: (element: T) => K): Map<K, T>;
    }

    interface MapConstructor {
        /**
         * Creates a new map from the provided elements.
         * @param source Elements to create the map from. If this is a string, it will be treated as a CSS selector.
         * @param keySelector Function that returns the key for each element.
         * @param valueSelector Function that returns the value for each element.
         */
        fromElements<T extends Element[] | string, K, V>(
            source: T,
            keySelector: (element: Element) => K,
            valueSelector: (element: Element) => V
        ): Map<K, V>;
    }

    interface SetConstructor {
        /**
         * Creates a new set from the provided elements.
         * @param source Elements to create the set from. If this is a string, it will be treated as a CSS selector.
         * @param valueSelector Function that returns the value for each element.
         */
        fromElements<T extends Element[] | string, K>(source: T, valueSelector: (element: Element) => K): Set<K>;
    }
}

Document.prototype.queryAndAssert = function<T extends Element>(selector: string): T {
    const element = this.querySelector<T>(selector);
    if (!element) throw new Error(`No element found for selector "${selector}"`);
    return element;
};

Document.prototype.queryAsArray = function<T = Element>(selector: string, valueSelector?: (element: Element) => T): T[] {
    if (!valueSelector) valueSelector = (element: Element) => element as T;
    const elements = this.querySelectorAll(selector);
    return Array.from(elements, valueSelector);
};

Document.prototype.queryAsSet = function<T = Element>(selector: string, valueSelector?: (element: Element) => T): Set<T> {
    if (!valueSelector) valueSelector = (element: Element) => element as T;
    const elements = this.queryAsArray<T>(selector, valueSelector);
    return new Set(elements);
};

Document.prototype.queryAsMap = function<T extends Element, K>(selector: string, keySelector: (element: T) => K): Map<K, T> {
    const elements = this.queryAsArray<T>(selector);
    const map = new Map<K, T>();
    for (const element of elements) {
        const key = keySelector(element);
        map.set(key, element);
    }
    return map;
};

Element.prototype.getAttributeStrict = function<T extends string>(attribute: string): T {
    const value = this.getAttribute(attribute)?.trim();
    if (!value) throw new Error(`Attribute "${attribute}" not found`);
    return value as T;
};

Element.prototype.getAttributeAsFloatStrict = function(attribute: string, allowNegative = false): number {
    const value = this.getAttributeStrict(attribute).trim();
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) throw new Error(`Could not parse attribute "${attribute}" as float`);

    if (!allowNegative) {
        const sign = Math.sign(parsed);
        if (sign === -1 || Object.is(sign, -0)) throw new Error('Parsed number is negative');
    };
    return parsed;
};

Element.prototype.getAttributeAsIntStrict = function(attribute: string, radix: number = 10, allowNegative = false): number {
    const value = this.getAttributeStrict(attribute).trim().replace(/\D/g, '');
    const parsed = Number.parseInt(value, radix);
    if (Number.isNaN(parsed)) throw new Error(`Could not parse attribute "${attribute}" as integer`);

    if (!allowNegative) {
        const sign = Math.sign(parsed);
        if (sign === -1 || Object.is(sign, -0)) throw new Error('Parsed number is negative');
    };
    return parsed;
};

Element.prototype.getTextContentStrict = function<T extends string>(): T {
    const content = this.textContent?.trim();
    if (!content) throw new Error('Element has no text content');
    return content as T;
};

Element.prototype.parseIntStrict = function(radix: number = 10, allowNegative = false): number {
    const content = this.getTextContentStrict().replace(/\D/g, '');
    const parsed = Number.parseInt(content, radix);
    if (Number.isNaN(parsed)) throw new Error('Could not parse text content as integer');

    if (!allowNegative) {
        const sign = Math.sign(parsed);
        if (sign === -1 || Object.is(sign, -0)) throw new Error('Parsed number is negative');
    };
    return parsed;
};

Element.prototype.parseFloatStrict = function(allowNegative = false): number {
    const content = this.getTextContentStrict();
    const parsed = Number.parseFloat(content);
    if (Number.isNaN(parsed)) throw new Error('Could not parse text content as float');

    if (!allowNegative) {
        const sign = Math.sign(parsed);
        if (sign === -1 || Object.is(sign, -0)) throw new Error('Parsed number is negative');
    };
    return parsed;
};

Element.prototype.queryAndAssert = function<T extends Element>(selector: string): T {
    const element = this.querySelector<T>(selector);
    if (!element) throw new Error(`No element found for selector "${selector}"`);
    return element;
};

Element.prototype.queryAsArray = function<T = Element>(selector: string, valueSelector?: (element: Element) => T): T[] {
    if (!valueSelector) valueSelector = (element: Element) => element as T;
    const elements = this.querySelectorAll(selector);
    return Array.from(elements, valueSelector);
};

Element.prototype.queryAsSet = function<T = Element>(selector: string, valueSelector?: (element: Element) => T): Set<T> {
    if (!valueSelector) valueSelector = (element: Element) => element as T;
    const elements = this.queryAsArray<T>(selector, valueSelector);
    return new Set(elements);
};

Element.prototype.queryAsMap = function<T extends Element, K>(selector: string, keySelector: (element: T) => K): Map<K, T> {
    const elements = this.queryAsArray<T>(selector);
    const map = new Map<K, T>();
    for (const element of elements) {
        const key = keySelector(element);
        map.set(key, element);
    };
    return map;
};

// Métodos estáticos.
Map.fromElements = function<T extends Element[] | string, K, V>(
    source: T,
    keySelector: (element: Element) => K,
    valueSelector: (element: Element) => V
): Map<K, V> {
    if (!Array.isArray(source) && !isString(source)) {
        throw new TypeError('Source must be an array or a string');
    };

    const elements: Element[] = Array.isArray(source) ? source : document.queryAsArray(source);
    const map = new Map<K, V>();
    for (const element of elements) {
        if (!isInstanceOf(element, Element)) {
            throw new TypeError('Item in source array is not an element');
        };

        const key = keySelector(element);
        const value = valueSelector(element);
        map.set(key, value);
    };
    return map;
};

Set.fromElements = function<T extends Element[] | string, K>(
    source: T,
    valueSelector: (element: Element) => K
): Set<K> {
    if (!Array.isArray(source) && !isString(source)) {
        throw new TypeError('Source must be an array or a string');
    };

    const elements: Element[] = Array.isArray(source) ? source : document.queryAsArray(source);
    const set = new Set<K>();
    for (const element of elements) {
        if (!isInstanceOf(element, Element)) {
            throw new TypeError('Item in source array is not an element');
        };
        const value = valueSelector(element);
        set.add(value);
    };
    return set;
};