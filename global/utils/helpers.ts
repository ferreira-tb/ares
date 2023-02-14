import { assertInteger, assertType } from '$global/utils/assert.js';
import { farmUnits } from '$global/utils/constants.js';
import { AresError } from '$global/error.js';
import type { FarmUnits, XMLTags } from '$types/game.js';

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

        return valueField.parseFloat();
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
    if (extra && Number.isInteger(extra)) time += extra;
    
    return new Promise<void>((resolve) => setTimeout(() => resolve(), time));
};

/** Gera um número inteiro entre dois outros. */
export function generateIntegerBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
};

export async function* fetchDocuments(urls: string[]) {
    const parser = new DOMParser();
    for (const url of urls) {
        assertType(typeof url === 'string', 'A URL é inválida');
        const response = await fetch(url);
        const text = await response.text();
        yield parser.parseFromString(text, 'text/html').documentElement;
    };
};

/**
 * Determina o mundo atual a partir da URL passada.
 * Se omitida, utiliza `location.href` como referência.
 */
export function getWorldFromURL(url?: URL) {
    if (!(url instanceof URL)) url = new URL(location.href);

    const index = url.hostname.indexOf('.tribalwars');
    if (index === -1) return null;
    
    let world = url.hostname.slice(0, index);
    world = world.replace(/www\.?/g, '');
    
    if (world.length < 1) return null;
    return world;
};

export function assertWorldFromURL(url?: URL): string {
    const world = getWorldFromURL(url);
    assertType(typeof world === 'string', 'Não foi possível determinar o mundo.');
    return world;
};

/**
 * Transforma um número em uma string com o formato de data local.
 * @param raw Número representando a data. Se omitido, utiliza `Date.now()`.
 * @param includeTime Indica se a string resultante deve incluir a hora.
 */
export function getLocaleDateString(raw?: number, includeTime: boolean = false): string {
    if (typeof raw !== 'number') raw = Date.now();
    assertInteger(raw);
    
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

/**
 * Verifica se a string passada é um nome de unidade válido.
 * @param unit Nome da unidade.
 */
export function isFarmUnit(unit: string): unit is FarmUnits {
    return farmUnits.includes(unit as FarmUnits);
};