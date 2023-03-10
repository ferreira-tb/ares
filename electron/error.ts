export class MainProcessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MainProcessError';
    };

    declare public static catch: (err: unknown) => Promise<void>;
};

export class ProxyStoreError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'ProxyStoreError';
    };
};

export class DatabaseError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    };
};

export class MainProcessEventError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'MainProcessEventError';
    };
};

export class ModuleCreationError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'ModuleCreationError';
    };
};

export class AliasPatchError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'AliasPatchError';
    };
};

export class WorldPatchError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'WorldPatchError';
    };
};