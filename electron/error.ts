import { AresError } from '$global/error';

export class MainProcessError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'MainProcessError';
    };

    /** Emite um erro falso no processo principal para fins de teste. */
    public static mock() {
        const error = new this('Isso é um teste.');
        this.catch(error);
    };
};

export class MechanusStoreError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'MechanusStoreError';
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

export class BrowserViewError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'BrowserViewError';
    };
};

export class DownloadError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'DownloadError';
    };
};