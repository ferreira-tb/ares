import { assertString, isInteger } from '@tb-dev/ts-guard';

/** Calcula distância em campos entre duas coordenadas. */
export function calcDistance(originX: number, originY: number, destX: number, destY: number) {
    return Math.sqrt(((destX - originX) ** 2) + ((destY - originY) ** 2));
};

/** Retorna o tempo de resposta do servidor. */
export function getResponseTime() {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigationTiming.responseEnd - navigationTiming.fetchStart;
};

/**
 * Cria um breve atraso tendo como base o tempo de resposta do servidor.
 * @param extra Tempo adicional (em milisegundos).
 */
export function wait(extra?: number) {
    let time = getResponseTime();
    if (time <= 0) time = 500;
    if (isInteger(extra)) time += extra;
    
    return new Promise<void>((resolve) => setTimeout(resolve, time));
};

/** Gera um número inteiro entre dois outros. */
export function generateIntegerBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
};

export async function* fetchDocuments(urls: string[]) {
    const parser = new DOMParser();
    for (const url of urls) {
        assertString(url, 'A URL é inválida');
        const response = await fetch(url);
        const text = await response.text();
        yield parser.parseFromString(text, 'text/html').documentElement;
    };
};

/**
 * Transforma um número em uma string com o formato de data local.
 * @param raw Número representando a data. Se omitido, utiliza `Date.now()`.
 * @param includeTime Indica se a string resultante deve incluir a hora.
 */
export function getLocaleDateString(raw?: number, includeTime: boolean = false): string {
    if (!isInteger(raw)) raw = Date.now();
    
    const dateObject = new Date(raw);
    const date = dateObject.toLocaleDateString('pt-br', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    if (includeTime === false) {
        return date;

    } else {
        const time = dateObject.toLocaleTimeString('pt-br', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `${date} ${time}`;
    };
};