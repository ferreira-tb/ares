import { assertString, isInteger } from '@tb-dev/ts-guard';
import { AresError } from '$global/error.js';
import type { XMLTags } from '$types/game.js';

/** Calcula distância em campos entre duas coordenadas. */
export function calcDistance(originX: number, originY: number, destX: number, destY: number) {
    return Math.sqrt(((destX - originX) ** 2) + ((destY - originY) ** 2));
};

/**
 * Retorna uma função que auxilia na análise dos documentos XML que contêm informações sobre o mundo.
 * @param xmlDocument Documento XML.
 * @param type Indica se o documento corresponde às configurações do mundo ou das unidades.
 */
export function queryXMLTags(xmlDocument: XMLDocument, type: 'world' | 'unit') {
    return function(tag: XMLTags): number {
        const valueField = xmlDocument.querySelector(tag);
        if (valueField === null) {
            // Caso não exista campo para arqueiros, assume que o mundo não os possui.
            if (type === 'unit' && /archer/.test(tag)) return 0;
            throw new AresError(`O campo \"${tag}\" não foi encontrado no documento XML.`);
        };

        return valueField.parseFloatStrict();
    };
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
    
    return new Promise<void>((resolve) => setTimeout(() => resolve(), time));
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

/** Determina o mundo atual a partir da URL passada. */
export function getWorldFromURL(url: URL): string | null {
    const index = url.hostname.indexOf('.tribalwars');
    if (index === -1) return null;
    
    let world = url.hostname.slice(0, index);
    world = world.replace(/www\.?/g, '');
    
    if (world.length < 1) return null;
    return world;
};

export function assertWorldFromURL(url: URL): string {
    const world = getWorldFromURL(url);
    assertString(world, 'Não foi possível determinar o mundo.');
    return world;
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