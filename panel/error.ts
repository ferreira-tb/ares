import { RendererProcessError } from '$renderer/error';

export class PanelError extends RendererProcessError {
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

export class PanelPlunderViewError extends PanelError {
    constructor(message: string) {
        super(message);
        this.name = 'PanelPlunderViewError';
    };
};

export class PanelSnobViewError extends PanelError {
    constructor(message: string) {
        super(message);
        this.name = 'PanelSnobViewError';
    };
};