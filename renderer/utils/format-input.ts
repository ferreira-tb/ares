function formatTime(type: 'horas' | 'milissegundos' | 'minutos' | 'segundos') {
    return function(time: number | null): string {
        if (typeof time !== 'number') return '';
        if (time < 2) return `${time} ${type.slice(0, -1)}`;
        return `${time} ${type}`;
    };
}

function parseTime(type: 'horas' | 'milissegundos' | 'minutos' | 'segundos') {
    return function(time: string): number | null {
        if (time.length === 0) return null;
        const regex = new RegExp(`\\s*${type.slice(0, -1)}s?`, 'i');
        time = time.replace(regex, '').trim();
        const parsed = Number.parseFloat(time);
        return Number.isNaN(parsed) ? null : parsed;
    };
}

export const formatHours = formatTime('horas');
export const parseHours = parseTime('horas');

export const formatMilliseconds = formatTime('milissegundos');
export const parseMilliseconds = parseTime('milissegundos');

export const formatMinutes = formatTime('minutos');
export const parseMinutes = parseTime('minutos');

export const formatSeconds = formatTime('segundos');
export const parseSeconds = parseTime('segundos');

export function formatFields(fields: number | null): string {
    if (typeof fields !== 'number') return '';
    if (fields < 2) return `${fields} campo`;
    return `${fields} campos`;
}

export function parseFields(fields: string): number | null {
    if (fields.length === 0) return null;
    fields = fields.replace(/\s*campos?/i, '').trim();
    const parsed = Number.parseFloat(fields);
    return Number.isNaN(parsed) ? null : parsed;
}

export function formatPercentage(percentage: number | null): string {
    if (typeof percentage !== 'number') return '';
    return `${(percentage * 100).toFixed(0)}%`;
}

export function parsePercentage(percentage: string): number | null {
    if (percentage.length === 0) return null;
    percentage = percentage.replace(/\s*%/, '').trim();
    const parsed = Number.parseFloat(percentage);
    return Number.isNaN(parsed) ? null : parsed / 100;
}

export function formatWallLevel(level: number | null): string {
    if (typeof level !== 'number') return '';
    return `Nível ${level}`;
}

export function parseWallLevel(level: string): number | null {
    if (level.length === 0) return null;
    level = level.replace(/n[íi]vel\s*/i, '').trim();
    const parsed = Number.parseFloat(level);
    return Number.isNaN(parsed) ? null : parsed;
}