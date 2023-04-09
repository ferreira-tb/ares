import * as fs from 'node:fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const startTime = Date.now();

    console.log('Corrigindo caminhos das fontes...');
    const assetsDir = path.resolve(__dirname, '../dist/assets');

    const regex = /url\s*\(\/?fonts/g;
    const replacement = 'url(../fonts';

    const files = await fs.readdir(assetsDir);
    const cssFiles = files.filter((file) => path.extname(file) === '.css' && file.startsWith('ui'));

    for (const file of cssFiles) {
        const cssFile = path.join(assetsDir, file);
        let fileContent = await fs.readFile(cssFile, { encoding: 'utf-8' });
        fileContent = fileContent.replace(regex, replacement);
        await fs.writeFile(cssFile, fileContent, { encoding: 'utf-8' });
    };

    console.log(`Fim dos trabalhos. Tempo total: ${Date.now() - startTime}ms.`);

} catch (err) {
    if (err instanceof Error) console.error(err);
};