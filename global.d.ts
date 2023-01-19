declare global {
    interface Document {
        queryAndAssert: (selector: string) => Element;
        queryAsArray: (selector: string) => Element[];
    }

    interface Element {
        queryAndAssert: (selector: string) => Element
        queryAsArray: (selector: string) => Element[];
    }
}

export {};