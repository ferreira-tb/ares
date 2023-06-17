import { RendererProcessError } from '$renderer/error';

export class PanelError extends RendererProcessError {
    public override name = 'PanelError';
};

export class PanelRouterError extends PanelError {
    public override readonly name = 'PanelRouterError';
};

export class PanelPlunderViewError extends PanelError {
    public override readonly name = 'PanelPlunderViewError';
};

export class PanelSnobViewError extends PanelError {
    public override readonly name = 'PanelSnobViewError';
};