import * as fs from 'node:fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const startTime = Date.now();

    const distDir = path.resolve(__dirname, '../dist');

    console.log('Editando o arquivo panel.html');
    
    const panelHtml = path.join(distDir, 'panel.html');
    let panelContent = await fs.readFile(panelHtml, { encoding: 'utf-8' });
    panelContent = panelContent.replace(/\"\/assets\//g, '\"assets\/');
    await fs.writeFile(panelHtml, panelContent, { encoding: 'utf-8' });

    console.log('Editando o arquivo modules.html');

    const modulesHtml = path.join(distDir, 'modules.html');
    let modulesContent = await fs.readFile(modulesHtml, { encoding: 'utf-8' });
    modulesContent = modulesContent.replace(/\"\/assets\//g, '\"assets\/');
    await fs.writeFile(modulesHtml, modulesContent, { encoding: 'utf-8' });

    console.log(`Fim dos trabalhos. Tempo total: ${Date.now() - startTime}ms.`);

} catch (err) {
    if (err instanceof Error) console.error(err);
};