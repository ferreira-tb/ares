export type ErrorLog = {
    readonly name: string;
    readonly message: string;
    readonly time: number;
};

export type DOMErrorLog = {
    readonly selector: string;
    readonly time: number;
};