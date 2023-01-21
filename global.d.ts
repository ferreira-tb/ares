declare global {
    interface Document {
        queryAndAssert: <T extends Element>(selector: string) => T;
        queryAsArray: <T extends Element>(selector: string) => T[];
    }

    interface Element {
        assertAttribute: <T extends string>(attribute: string) => T;
        assertAttributeAsInt: (attribute: string, allowNegative?: boolean, radix?: number) => number;
        parseInt: (allowNegative?: boolean, radix?: number) => number;
        parseFloat: (allowNegative?: boolean) => number;
        queryAndAssert: <T extends Element>(selector: string) => T;
        queryAsArray: <T extends Element>(selector: string) => T[];
    }

    interface Map<K, V> {
        assert: (key: K) => V;
    }
}

export {};