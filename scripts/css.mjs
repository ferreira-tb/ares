import * as fs from 'node:fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const startTime = Date.now();

    const distDir = path.resolve(__dirname, '../dist');

    console.log('Renomeando o arquivo style.css.');
    
    const styleCss = path.join(distDir, 'style.css');
    const browserCss = path.join(distDir, 'browser.css');
    await fs.rename(styleCss, browserCss);

    console.log(`Fim dos trabalhos. Tempo total: ${Date.now() - startTime}ms.`);

} catch (err) {
    if (err instanceof Error) console.error(err);
};