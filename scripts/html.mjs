import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const startTime = Date.now();

    console.log('Editando arquivos html...');
    const distDir = path.resolve(__dirname, '../dist');

    const panelHtml = path.join(distDir, 'panel.html');
    await fixHtmlFile(panelHtml);

    const modulesHtml = path.join(distDir, 'modules.html');
    await fixHtmlFile(modulesHtml);

    const uiHtml = path.join(distDir, 'ui.html');
    await fixHtmlFile(uiHtml);

    console.log(`Fim dos trabalhos. Tempo total: ${Date.now() - startTime}ms.`);

} catch (err) {
    if (err instanceof Error) console.error(err);
};

async function fixHtmlFile(htmlFile) {
    let fileContent = await fs.readFile(htmlFile, { encoding: 'utf-8' });
    fileContent = fileContent.replace(/\"\/assets\//g, '\"assets\/');
    await fs.writeFile(htmlFile, fileContent, { encoding: 'utf-8' });
};