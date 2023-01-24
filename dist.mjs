import * as fs from 'node:fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const startTime = Date.now();

    const distDir = path.resolve(__dirname, '__dist__');

    console.log('Editando o arquivo index.html');
    
    const indexFile = path.resolve(distDir, 'index.html');
    let printerContent = await fs.readFile(indexFile, { encoding: 'utf-8' });
    printerContent = printerContent.replaceAll('\"\/assets\/', '\"assets\/');

    await fs.writeFile(indexFile, printerContent, { encoding: 'utf-8' });

    console.log(`Fim dos trabalhos. Tempo total: ${Date.now() - startTime}ms.`);

} catch (err) {
    if (err instanceof Error) console.error(err);
};