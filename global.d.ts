declare global {
    interface Document {
        queryAndAssert: (selector: string) => Element;
        queryAsArray: (selector: string) => Element[];
    }

    interface Element {
        assertAttribute: <T extends string>(attribute: string) => T;
        assertAttributeAsInt: (attribute: string, allowNegative?: boolean, radix?: number) => number;
        parseInt: (allowNegative?: boolean, radix?: number) => number;
        parseFloat: (allowNegative?: boolean) => number;
        queryAndAssert: (selector: string) => Element;
        queryAsArray: (selector: string) => Element[];
    }
}

export {};