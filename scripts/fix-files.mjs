import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { existsSync as exists } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const distDir = path.resolve(__dirname, '../dist');
    const assetsDir = path.join(distDir, 'assets');

    // HTML
    const windows = path.join(distDir, 'windows.html');
    const ui = path.join(distDir, 'ui.html');
    await Promise.all([windows, ui].map(html));

    // CSS
    const style = path.join(distDir, 'style.css');
    const browser = path.join(distDir, 'browser.css');
    if (exists(style)) await fs.rename(style, browser);

    // Fontes
    const regex = /url\s*\(\/?fonts/g;
    const replacement = 'url(../fonts';

    const files = await fs.readdir(assetsDir);
    const cssFiles = files.filter((file) => {
        return path.extname(file) === '.css' && file.startsWith('ui');
    });

    for (const file of cssFiles) {
        const cssFile = path.join(assetsDir, file);
        let fileContent = await fs.readFile(cssFile, { encoding: 'utf-8' });
        fileContent = fileContent.replace(regex, replacement);
        await fs.writeFile(cssFile, fileContent, { encoding: 'utf-8' });
    };
    
} catch (err) {
    console.error(err);
    process.exit(1);
};

async function html(file) {
    if (!exists(file)) return;
    let content = await fs.readFile(file, { encoding: 'utf-8' });
    content = content.replace(/\"\/assets\//g, '\"assets\/');
    await fs.writeFile(file, content, { encoding: 'utf-8' });
};