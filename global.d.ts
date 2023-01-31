declare global {
    interface Document {
        queryAndAssert: <T extends Element>(selector: string) => T;
        queryAsArray: <T extends Element>(selector: string) => T[];
    }

    interface Element {
        assertAttribute: <T extends string>(attribute: string) => T;
        assertAttributeAsInt: (attribute: string, allowNegative?: boolean, radix?: number) => number;
        assertTextContent: <T extends string>() => T;
        parseInt: (allowNegative?: boolean, radix?: number) => number;
        parseFloat: (allowNegative?: boolean) => number;
        queryAndAssert: <T extends Element>(selector: string) => T;
        queryAsArray: <T extends Element>(selector: string) => T[];
    }

    interface Map<K, V> {
        /**
         * Retorna um item cuja chave corresponda à fornecida ao método.
         * Se nenhum corresponder, emite um erro.
         */
        assert: (key: K) => V;
    }

    interface URLSearchParams {
        assert: <T extends string>(name: string) => T;
        assertAsInteger: (name: string, radix?: number) => number;
    }

    interface NumberConstructor {
        assertInteger(rawString: string, radix?: number): number
    }
}

export {};