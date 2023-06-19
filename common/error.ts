export class AresError extends Error {
    declare public static catch: (err: unknown, ...args: any[]) => Promise<void>;

    public override name = 'AresError';
    
    public static generateLogContent(err: AllErrorLogTypes | AllErrorLogTypes[]) {
        const errors = Array.isArray(err) ? err : [err];

        let content = '';
        for (const error of errors) {
            const date = new Date(error.time).toLocaleString('pt-br');
            content += `${date}\nAres: ${error.ares} Electron: ${error.electron} Chrome: ${error.chrome}\n`;
            content += `Tribal Wars: ${error.tribal ?? 'unknown'} Locale: ${error.locale ?? 'unknown'}\n`;
            content += `${error.stack ?? error.message}\n\n`;
        };

        return content;
    };
};