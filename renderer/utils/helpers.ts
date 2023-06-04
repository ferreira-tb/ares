type LocaleDateStringOptions = {
    seconds?: boolean;
};

/**
 * Transforma um número em uma string com o formato de data local.
 * @param raw Número representando a data. Se omitido, utiliza `Date.now()`.
 * @param includeTime Indica se a string resultante deve incluir a hora.
 */
export function getLocaleDateString(
    locale: Intl.LocalesArgument = 'pt-br',
    raw?: number,
    options?: LocaleDateStringOptions
) {
    if (typeof raw !== 'number' || !Number.isInteger(raw)) {
        raw = Date.now();
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit'
    };

    if (options?.seconds) timeOptions.second = '2-digit';

    const date = new Date(raw);
    const dateString = date.toLocaleDateString(locale, dateOptions);
    const timeString = date.toLocaleTimeString(locale, timeOptions);
    return `${dateString} ${timeString}`;
};