import { useBrowserStore } from '$renderer/stores';

/**
 * Cria um breve atraso tendo como base o tempo de resposta do servidor.
 * @param extra Tempo adicional (em milisegundos).
 */
export function wait(extra?: number) {
    const browserStore = useBrowserStore();
    let responseTime = browserStore.responseTime ?? 200;
    if (extra) responseTime += extra;
    
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), responseTime);
    });
}