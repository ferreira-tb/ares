import type { WebContents } from 'electron';
import type { MechanusRef } from 'mechanus';

export interface BrowserViewStore {
    /** Todos os WebContents de BrowserViews associados à janela principal. */
    readonly allWebContents: Set<WebContents>;
    /** Todos os WebContents de BrowserViews com eventos já registrados. */
    readonly registeredWebContents: WeakSet<WebContents>;
    /** O WebContents atualmente ativo (em primeiro plano). */
    readonly currentWebContents: WebContents | null;
    /** Função para remover o evento de redimensionamento do WebContents ativo. */
    readonly currentAutoResize: (() => void) | null;
};

export type MechanusBrowserViewStoreType = {
    [K in keyof BrowserViewStore]: MechanusRef<BrowserViewStore[K]>;
};

export type BackForwardStatus = {
    canGoBack: boolean;
    canGoForward: boolean;
};