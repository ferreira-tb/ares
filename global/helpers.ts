import { assert, assertArrayIncludes, assertInteger, assertType, ClaustrophobicError } from "#/error.js";
import { months } from "#/constants.js";
import type { XMLTags } from '@/game.js';

/**
 * Analisa o texto contido num elemento a procura de coordenadas válidas.
 * @param text Texto do elemento.
 * @returns Tupla com as coordenadas ou `null` se elas não forem encontradas.
 */
export function parseCoordsFromTextContent(text: string | null): [number, number] | null {
    if (!text) return null;

    const targetCoords = text.trim().match(/\d\d\d\|\d\d\d/m);
    if (!targetCoords) return null;

    const coords = targetCoords[0].split('\|')
        .map((value) => Number.parseInt(value, 10))
        .filter((value) => !Number.isNaN(value));

    assert(coords.length === 2, 'As coordenadas são inválidas.');
    return coords as [number, number];
};

export function assertCoordsFromTextContent(text: string | null): [number, number] {
    const coords = parseCoordsFromTextContent(text);
    assertType(Array.isArray(coords), 'Não foi possível obter as coordenadas a partir da string.');
    return coords;
};

/**
 * Converte uma data para milisegundos.
 * 
 * Exemplos de data: `hoje às 00:05:26`, `ontem às 16:29:50`, `em 21.09. às 12:36:38`.
 * 
 * Relevante: https://github.com/ferreira-tb/insidious/issues/2
 * @param date - Texto do campo a analisar.
 * @returns Data do último ataque em milisegundos.
 */
export function parseGameDate(date: string): number | null {
    const writtenDate = date.trim().toLowerCase();
    if (!writtenDate.includes('às')) return null;

    // splitDate representa as horas, os minutos e os segundos (possivelmente também os milisegundos).
    const splitDate: string | undefined = writtenDate.split(' ').pop();
    if (!splitDate) return null;

    const dateFields = splitDate.split('\:').map(item => Number.parseInt(item, 10));
    if (dateFields.length < 3) return null;
    if (dateFields.some((item) => Number.isNaN(item))) return null;

    // Detalhes da data.
    const [hours, minutes, seconds] = dateFields;
    const milliseconds = dateFields[3] ?? 0;

    // Se o ataque foi hoje, toma o horário atual e apenas ajusta os detalhes.
    if (writtenDate.includes('hoje')) {       
        return new Date().setHours(hours, minutes, seconds, milliseconds);

    // Se foi ontem ou se for amanhã, faz a mesma coisa, mas remove ou adiciona 24 horas do resultado.
    } else if (writtenDate.includes('ontem')) {
        const yesterday = Date.now() - (3600000 * 24);
        return new Date(yesterday).setHours(hours, minutes, seconds, milliseconds);

    } else if (writtenDate.includes('amanhã')) {
        const tomorrow = Date.now() + (3600000 * 24);
        return new Date(tomorrow).setHours(hours, minutes, seconds, milliseconds);

    } else if (writtenDate.includes('em')) {
        // Em outros cenários, também altera o dia e o mês.
        const dayAndMonth = (writtenDate.split(' '))[1];
        const [day, month] = dayAndMonth.split('.')
            .map((item) => Number.parseInt(item, 10))
            .filter((item) => !Number.isNaN(item));

        const anyDay = new Date().setHours(hours, minutes, seconds, milliseconds);
        // O valor para o mês possui índice zero, por isso é preciso diminuí-lo em 1.
        return new Date(anyDay).setMonth(month - 1, day);
    };

    return null;
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
            if (type === 'unit' && tag.includes('archer')) return 0;
            throw new ClaustrophobicError(`O campo \"${tag}\" não foi encontrado no documento XML.`);
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

/**
 * Analisa um relatório e retorna a data de quando ele foi gerado.
 * @param report Elemento HTML onde o relatório está contido.
 * @param ms Indica se o resultado deve ser retornado em milisegundos.
 * Se `false`, o resultado será retornado em segundos.
 */
export function parseReportDate(report: Element, ms: boolean = true) {
    const selector = 'td.nopad table:has([class="report_ReportAttack" i]) tr:nth-of-type(2) td:nth-of-type(2)';
    const dateField = report.queryAndAssert(selector);

    // Exemplo: "out. 17, 2022  22:16:46:503".
    const rawDate = dateField.assertTextContent();

    const rawDateFields = rawDate.split(' ')
        .filter((value) => value)
        .map((value) => value.trim());

    const getDigits = (value: string) => Number.parseInt(value.replace(/\D/g, ''), 10);

    const dateFields = rawDateFields.map((field, index) => {
        if (index === 0) {
            const month = field.replace(/\W/g, '').slice(0, 3);
            assertType(month && typeof month === 'string', 'O mês obtido é inválido.');
            assertArrayIncludes((months as unknown) as string[], month, 'O mês obtido é inválido.');
            
            // Date.prototype.setFullYear() usa índice zero para os meses.
            return ((months as unknown) as string[]).indexOf(month as any);

        } else if (index === 3) {
            return field.split(':').map((value) => getDigits(value));
  
        } else {
            return getDigits(field);
        };
    });

    const year = dateFields[2] as number;
    const month = dateFields[0] as number;
    const day = dateFields[1] as number;
    const fullYear = new Date().setFullYear(year, month, day);

    const [hour, minute, second, millisec] = dateFields[3] as number[];
    const date = new Date(fullYear).setHours(hour, minute, second, millisec);
    assertInteger(date, 'A data obtida é inválida.');

    if (ms === false) return Math.ceil(date / 1000);
    return date;
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
    
    const world = url.hostname.slice(0, index);
    return world.replace(/www\.?/g, '');
};

export function assertWorldFromURL(url?: URL) {
    const world = getWorldFromURL(url);
    assertType(typeof world === 'string', 'Não foi possível determinar o mundo.');
    return world;
};

export function getLocaleDateString(raw?: number, includeTime: boolean = false) {
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