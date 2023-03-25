import { useAresStore } from '$vue/stores/ares';

/**
 * Cria um breve atraso tendo como base o tempo de resposta do servidor.
 * @param extra Tempo adicional (em milisegundos).
 */
export function wait(extra?: number) {
    const aresStore = useAresStore();
    let responseTime = aresStore.responseTime ?? 200;
    if (extra) responseTime += extra;
    
    return new Promise<void>((resolve) => setTimeout(resolve, responseTime));
};