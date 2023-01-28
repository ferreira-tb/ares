import * as fs from 'node:fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const startTime = Date.now();

    const distDir = path.resolve(__dirname, '__dist__');

    console.log('Editando o arquivo index.html do painel.');
    
    const indexFile = path.resolve(distDir, 'index.html');
    let indexContent = await fs.readFile(indexFile, { encoding: 'utf-8' });
    indexContent = indexContent.replace(/\"\/assets\//g, '\"assets\/');
    await fs.writeFile(indexFile, indexContent, { encoding: 'utf-8' });

    console.log('Editando o arquivo index.html dos módulos.');

    const moduleFile = path.resolve(distDir, 'modules.html');
    let moduleContent = await fs.readFile(moduleFile, { encoding: 'utf-8' });
    moduleContent = moduleContent.replace(/\"\/assets\//g, '\"assets\/');
    await fs.writeFile(moduleFile, moduleContent, { encoding: 'utf-8' });

    console.log(`Fim dos trabalhos. Tempo total: ${Date.now() - startTime}ms.`);

} catch (err) {
    if (err instanceof Error) console.error(err);
};