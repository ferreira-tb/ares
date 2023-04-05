import { AresError } from '$global/error';

export class PanelError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'PanelError';
    };
};

export class PanelRouterError extends PanelError {
    constructor(message: string) {
        super(message);
        this.name = 'PanelRouterError';
    };
};

export class PanelPlunderError extends PanelError {
    constructor(message: string) {
        super(message);
        this.name = 'PanelPlunderError';
    };
};