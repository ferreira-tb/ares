export class MainProcessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MainProcessError';
    };

    declare public static catch: (err: unknown) => Promise<void>;
};

export class ProxyStoreError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProxyStoreError';
    };

    declare public static catch: (err: unknown) => Promise<void>;
};

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    };

    declare public static catch: (err: unknown) => Promise<void>;
};