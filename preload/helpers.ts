import { pinia } from '$/preload.js';
import { assert, assertElement } from "@/error.js";
import { usePhobiaStore } from '@/stores/store.js';

/** Obtêm as coordenadas da aldeia atual a partir do DOM e as salva na store. */
export function queryCurrentVillageCoords() {
    const selector = '#header_info tr#menu_row2 td:not(:has(a[href*="screen=overview"])):has(b)';
    const coordsField = document.querySelector(selector);
    assertElement(coordsField, selector);

    const coords = parseCoordsFromTextContent(coordsField.textContent);
    assert(Array.isArray(coords), 'Não foi possível obter as coordenadas da aldeia atual.');

    const phobiaStore = usePhobiaStore(pinia);
    phobiaStore.currentX = coords[0];
    phobiaStore.currentY = coords[1];
};

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
        .map(value => Number.parseInt(value, 10))
        .filter(value => !Number.isNaN(value));

    assert(coords.length === 2, 'As coordenadas são inválidas.');
    return coords as [number, number];
};

/** Calcula distância em campos entre duas coordenadas. */
export function calcDistance(destX: number, destY: number, originX?: number, originY?: number) {
    const phobiaStore = usePhobiaStore(pinia);
    if (typeof originX !== 'number') originX = phobiaStore.currentX;
    if (typeof originY !== 'number') originY = phobiaStore.currentY;

    return Math.sqrt(((destX - originX) ** 2) + ((destY - originY) ** 2));
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
    if (dateFields.some(item => Number.isNaN(item))) return null;

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
            .map(item => Number.parseInt(item, 10))
            .filter(item => !Number.isNaN(item));

        const anyDay = new Date().setHours(hours, minutes, seconds, milliseconds);
        // O valor para o mês possui índice zero, por isso é preciso diminuí-lo em 1.
        return new Date(anyDay).setMonth(month - 1, day);
    };

    return null;
};