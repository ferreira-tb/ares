import { assert, assertInteger, assertString, assertArrayIncludes, assertArray } from '@tb-dev/ts-guard';
import { months } from '$global/constants';

/**
 * Analisa o texto contido num elemento a procura de coordenadas válidas.
 * @param text Texto do elemento.
 * @returns Tupla com as coordenadas ou `null` se elas não forem encontradas.
 */
export function parseCoordsFromTextContent(text: string | null): [number, number] | null {
    if (!text) return null;

    const targetCoords = text.trim().match(/\d{3}\|\d{3}/m);
    if (!targetCoords) return null;

    const coords = targetCoords[0].splitAsIntegerListStrict('|');
    assert(coords.length === 2, 'Expected a XY tuple, but got a different length.');
    return coords as [number, number];
};

export function parseCoordsFromTextContentStrict(text: string | null): [number, number] {
    const coords = parseCoordsFromTextContent(text);
    assertArray(coords, 'Could not parse coords from text content.');
    return coords;
};

/**
 * Converte uma data para milisegundos.
 * Exemplos de data: `hoje às 00:05:26`, `ontem às 16:29:50`, `em 21.09. às 12:36:38`.
 * 
 * @see https://github.com/ferreira-tb/insidious/issues/2
 * @param date - Texto do campo a analisar.
 * @returns Data do último ataque em milisegundos.
 */
export function parseGameDate(date: string): number | null {
    const writtenDate = date.trim().toLowerCase();
    if (!writtenDate.includes('às')) return null;

    // splitDate representa as horas, os minutos e os segundos (possivelmente também os milisegundos).
    const splitDate: string | undefined = writtenDate.split(' ').pop();
    if (!splitDate) return null;

    const dateFields = splitDate.splitAsIntegerList(':');
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
        return Date.yesterday().toDate().setHours(hours, minutes, seconds, milliseconds);

    } else if (writtenDate.includes('amanhã')) {
        return Date.tomorrow().toDate().setHours(hours, minutes, seconds, milliseconds);

    } else if (writtenDate.includes('em')) {
        // Em outros cenários, também altera o dia e o mês.
        const dayAndMonth = (writtenDate.split(' '))[1];
        const [day, month] = dayAndMonth.splitAsIntegerListStrict('.');

        const anyDay = new Date().setHours(hours, minutes, seconds, milliseconds);
        // O valor para o mês possui índice zero, por isso é preciso diminuí-lo em 1.
        return new Date(anyDay).setMonth(month - 1, day);
    };

    return null;
};

/**
 * Analisa um relatório e retorna a data de quando ele foi gerado.
 * @param report Elemento HTML onde o relatório está contido.
 * @param ms Indica se o resultado deve ser retornado em milisegundos.
 * Se `false`, o resultado será retornado em segundos.
 */
export function parseReportDate(report: Element, ms: boolean = true): number {
    const selector = 'td.nopad table:has([class="report_ReportAttack" i]) tr:nth-of-type(2) td:nth-of-type(2)';
    const dateField = report.queryAndAssert(selector);

    // Exemplo: "out. 17, 2022  22:16:46:503".
    const rawDate = dateField.getTextContentStrict();
    const rawDateFields = rawDate.splitAndTrim(' ');

    const getDigits = (value: string) => Number.parseInt(value.replace(/\D/g, ''), 10);

    const dateFields = rawDateFields.map((field, index) => {
        if (index === 0) {
            const rawMonth: string = field.replace(/\W/g, '').slice(0, 3);
            assertString(rawMonth, 'Invalid month.');
            assertArrayIncludes((months as unknown) as string[], rawMonth, 'Invalid month.');
            
            // Date.prototype.setFullYear() usa índice zero para os meses.
            return ((months as unknown) as string[]).indexOf(rawMonth);

        } else if (index === 3) {
            return field.split(':').map((value) => getDigits(value));
        };

        return getDigits(field);
    });

    const year = dateFields[2] as number;
    const month = dateFields[0] as number;
    const day = dateFields[1] as number;
    const fullYear = new Date().setFullYear(year, month, day);

    const [hour, minute, second, millisec] = dateFields[3] as number[];
    const date = new Date(fullYear).setHours(hour, minute, second, millisec);
    assertInteger(date, 'Invalid report date.');

    if (!ms) return Math.ceil(date / 1000);
    return date;
};